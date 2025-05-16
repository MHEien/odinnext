#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Configuration
const PROJECT_ROOT = process.cwd();
const MESSAGES_DIR = path.join(PROJECT_ROOT, 'messages');
const IGNORED_PATHS = ['node_modules', '.next', 'dist'];
const IGNORED_KEYS = ['Admin']; // From your i18n-ally config
const DEBUG = true; // Set to true to enable debug logging

interface LocaleMessages {
  [key: string]: string | LocaleMessages;
}

async function main() {
  console.log('🔍 Scanning for translation keys...');
  
  // Check for command line arguments
  const forceTranslate = process.argv.includes('--force');
  const listMissingOnly = process.argv.includes('--list-missing');
  const verboseOutput = process.argv.includes('--verbose');
  const diagnosticMode = process.argv.includes('--diagnostic');
  
  if (verboseOutput || diagnosticMode) {
    console.log(`🛠️ Running with options: ${[
      forceTranslate && '--force',
      listMissingOnly && '--list-missing',
      verboseOutput && '--verbose',
      diagnosticMode && '--diagnostic'
    ].filter(Boolean).join(', ') || 'none'}`);
    
    if (diagnosticMode) {
      console.log(`
📋 Diagnostic mode enabled - this will:
   - Show detailed information about key extraction
   - Log each translation key found and its source
   - Report any suspicious key patterns
   - Check both translations files and report differences
      `);
    }
  }
  
  // Load existing translation files
  const enPath = path.join(MESSAGES_DIR, 'en.json');
  const noPath = path.join(MESSAGES_DIR, 'no.json');
  
  let enMessages: LocaleMessages = {};
  let noMessages: LocaleMessages = {};
  
  try {
    enMessages = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    console.log('✅ Loaded English translations');
    if (DEBUG) {
      console.log(`English messages structure (first level):`);
      console.log(Object.keys(enMessages));
    }
  } catch {
    console.log('⚠️ Could not load English translations, creating new file');
  }
  
  try {
    noMessages = JSON.parse(fs.readFileSync(noPath, 'utf8'));
    console.log('✅ Loaded Norwegian translations');
  } catch {
    console.log('⚠️ Could not load Norwegian translations, creating new file');
  }
  
  // Find all JS/TS/TSX/JSX files in the components and app directories
  const files = await glob('src/{components,app}/**/*.{js,jsx,ts,tsx}', {
    cwd: PROJECT_ROOT,
    ignore: IGNORED_PATHS
  });
  
  console.log(`🔎 Found ${files.length} files to scan`);
  
  // Log the first few files to verify we're looking at the right ones
  if (files.length > 0) {
    console.log("First few files being scanned:");
    files.slice(0, Math.min(5, files.length)).forEach(file => console.log(`  - ${file}`));
  }
  
  // Regular expressions to find translation keys
  // Match direct translation use like t('key')
  const directTransRegex = /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  
  // Match useTranslations('prefix') pattern
  const useTranslationsRegex = /useTranslations\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  
  // Match segmented translation variable definitions like const navT = t('prefix')
  const segmentedTransRegexDefine = /const\s+(\w+T?)\s*=\s*(?:t|useTranslations)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  
  // Match translation function usage like t('key') or productT('name')
  const anyTransFuncRegex = /(\w+[tT]?)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  
  // Patterns for string interpolation in keys like `${status}`
  const interpolationPattern = /\${[^}]+}/g;
  
  // Store found segmented translation variables and their prefixes
  const segmentedTransVars: { [varName: string]: string } = {};
  
  // Store all found keys
  const foundKeys: Set<string> = new Set();
  
  // Store diagnostic info
  const fileKeys: { [file: string]: string[] } = {};
  
  // Process each file
  for (const file of files) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    // Skip directories - only read files
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Reset variables for each file
      const fileTransVars: { [varName: string]: string } = {};
      
      // Track file path for debugging
      const relativePath = file.replace(/\\/g, '/');
      
      if (DEBUG && verboseOutput) {
        console.log(`\nProcessing file: ${relativePath}`);
      }
      
      // First, find useTranslations and segmented translation definitions
      // Example: const t = useTranslations('Products') or const navT = t('Navigation')
      let translationVarMatch;
      while ((translationVarMatch = segmentedTransRegexDefine.exec(content)) !== null) {
        const [, varName, namespace] = translationVarMatch;
        fileTransVars[varName] = namespace;
        
        if (DEBUG && verboseOutput) {
          console.log(`  Found variable definition: const ${varName} = t/useTranslations('${namespace}')`);
        }
      }
      
      // Find direct translation keys with global t function
      // Example: t('key')
      let directMatch;
      while ((directMatch = directTransRegex.exec(content)) !== null) {
        const [, key] = directMatch;
        foundKeys.add(key);
        
        if (DEBUG && verboseOutput) {
          console.log(`  Found direct key: t('${key}')`);
        }
        
        // Track keys for diagnostics
        if (diagnosticMode) {
          if (!fileKeys[relativePath]) {
            fileKeys[relativePath] = [];
          }
          fileKeys[relativePath].push(key);
        }
      }
      
      // Find any translation function usages and apply namespace if applicable
      // This handles both t('key') and namespaced translations like productT('name')
      let anyTransMatch;
      while ((anyTransMatch = anyTransFuncRegex.exec(content)) !== null) {
        const [, funcName, key] = anyTransMatch;
        
        // Skip if this doesn't look like a translation function
        if (!funcName.match(/[tT]$/) && funcName !== 't') {
          continue;
        }
        
        // Skip if it's a direct t('key') - we already handled that above
        if (funcName === 't') {
          continue;
        }
        
        // If this is a namespaced translation function
        if (fileTransVars[funcName]) {
          const namespace = fileTransVars[funcName];
          const fullKey = `${namespace}.${key}`;
          foundKeys.add(fullKey);
          
          if (DEBUG && verboseOutput) {
            console.log(`  Found namespaced key: ${funcName}('${key}') -> '${fullKey}'`);
          }
          
          // Track keys for diagnostics
          if (diagnosticMode) {
            if (!fileKeys[relativePath]) {
              fileKeys[relativePath] = [];
            }
            fileKeys[relativePath].push(fullKey);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}: ${error}`);
      continue;
    }
  }
  
  console.log(`🔑 Found ${foundKeys.size} translation keys`);
  
  // Debug: Log all found keys if in debug mode
  if (DEBUG) {
    console.log(`\nAll found keys (${foundKeys.size}):`);
    const sortedKeys = [...foundKeys].sort();
    sortedKeys.forEach(key => console.log(`  - ${key}`));
    console.log(); // Empty line for readability
  }
  
  if (DEBUG && diagnosticMode) {
    // Export diagnostic information
    const diagnosticData = {
      processedFiles: files.length,
      foundKeys: Array.from(foundKeys).sort(),
      fileKeys,
      enMessages: Object.keys(enMessages),
      noMessages: Object.keys(noMessages),
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(PROJECT_ROOT, 'translation-diagnostic.json'),
      JSON.stringify(diagnosticData, null, 2)
    );
    
    console.log(`🔍 Exported diagnostic data to translation-diagnostic.json`);
  }
  
  // Find missing keys
  const missingKeysInEn: string[] = [];
  let missingKeysInNo: string[] = [];
  const existingKeys: string[] = []; 
  
  for (const key of foundKeys) {
    // Track a few sample existing keys for confirmation
    if (existingKeys.length < 5 && isKeyInMessages(enMessages, key)) {
      existingKeys.push(key);
    }
    
    // Check for missing keys with proper handling of case sensitivity
    if (!isKeyInMessages(enMessages, key, true)) {
      missingKeysInEn.push(key);
    }
    if (!isKeyInMessages(noMessages, key, true)) {
      missingKeysInNo.push(key);
    }
  }
  
  console.log(`📝 Missing ${missingKeysInEn.length} keys in English translations`);
  console.log(`📝 Missing ${missingKeysInNo.length} keys in Norwegian translations`);
  
  // Export missing keys to JSON files for review
  if (missingKeysInEn.length > 0 || missingKeysInNo.length > 0) {
    const missingKeysData = {
      en: missingKeysInEn,
      no: missingKeysInNo,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(PROJECT_ROOT, 'missing-translation-keys.json'),
      JSON.stringify(missingKeysData, null, 2)
    );
    
    console.log(`📄 Exported missing keys to missing-translation-keys.json`);
  }
  
  // Debug: Log all missing keys if in debug mode
  if (DEBUG && missingKeysInEn.length > 0) {
    console.log(`\nMissing keys in English (${missingKeysInEn.length}):`);
    missingKeysInEn.sort().forEach(key => console.log(`  - ${key}`));
    console.log(); // Empty line for readability
  }
  
  if (existingKeys.length > 0) {
    console.log(`🔍 Sample existing keys found in your translations:`);
    existingKeys.forEach(key => console.log(`  - ${key}`));
  }
  
  // Add missing keys to English translations first
  for (const key of missingKeysInEn) {
    // For simplicity, we'll use the key itself as the default English text
    const defaultText = key.split('.').pop() || key;
    addNestedKey(enMessages, key, defaultText);
  }
  
  // Save updated English translations
  if (missingKeysInEn.length > 0) {
    fs.writeFileSync(enPath, JSON.stringify(enMessages, null, 2));
    console.log(`💾 Updated English translations`);
  }
  
  // Now translate and add missing keys to Norwegian translations
  if (missingKeysInNo.length > 0) {
    console.log(`🌐 Found ${missingKeysInNo.length} keys missing in Norwegian translations`);
    
    // If there are many missing keys, ask for confirmation
    if (missingKeysInNo.length > 50 && !forceTranslate && !listMissingOnly) {
      console.log(`\n⚠️ Warning: There are ${missingKeysInNo.length} keys to translate. This may take some time and use API credits.`);
      
      console.log(`
📋 Command options:
   bun extractKeys.ts --force        Translate all ${missingKeysInNo.length} missing keys
   bun extractKeys.ts --list-missing Only list the missing keys (no translation)
   bun extractKeys.ts                Translate just 10 keys for testing
   
✅ Currently limiting to 10 translations. Use options above to change behavior.
        `);
      
      // Limit to 10 keys for testing
      missingKeysInNo = missingKeysInNo.slice(0, 10);
      console.log(`🔎 Processing only the first 10 missing keys for testing:`);
      missingKeysInNo.forEach(key => console.log(`  - ${key}`));
    } else if (listMissingOnly) {
      console.log(`\nMissing keys in Norwegian (${missingKeysInNo.length}):`);
      missingKeysInNo.sort().forEach(key => console.log(`  - ${key}`));
      return;
    }
    
    console.log(`\n🌐 Translating ${missingKeysInNo.length} keys to Norwegian...`);
    
    for (const key of missingKeysInNo) {
      // Get the English text for this key
      const englishText = getNestedValue(enMessages, key) as string;
      
      if (typeof englishText === 'string') {
        try {
          // Translate using Vercel AI SDK
          const norwegianText = await translateText(englishText, 'en', 'no');
          console.log(`🔄 Translated: "${englishText}" → "${norwegianText}"`);
          
          // Add to Norwegian messages
          addNestedKey(noMessages, key, norwegianText);
        } catch (error) {
          console.error(`❌ Error translating key "${key}": ${error}`);
          // Use English text as fallback
          addNestedKey(noMessages, key, englishText);
        }
      }
    }
    
    // Save updated Norwegian translations
    fs.writeFileSync(noPath, JSON.stringify(noMessages, null, 2));
    console.log(`💾 Updated Norwegian translations`);
  }
  
  console.log('✅ Translation key management completed!');
}

// Check if a key exists in the messages object
// Improved to handle case sensitivity and path normalization
function isKeyInMessages(messages: LocaleMessages, key: string, caseSensitive = false): boolean {
  // Skip interpolated keys like 'Status.${status}' - consider them as existing
  if (key.includes('${')) {
    return true;
  }
  
  // Normalize the key by handling common patterns
  const normalizedKey = normalizeKey(key);
  
  if (caseSensitive) {
    return directKeyCheck(messages, normalizedKey);
  } else {
    return caseInsensitiveKeyCheck(messages, normalizedKey);
  }
}

// Normalize a key by handling common patterns
function normalizeKey(key: string): string {
  // Handle interpolation patterns
  if (key.includes('${')) {
    // Leave interpolated keys as is, we'll consider them valid
    return key;
  }
  
  return key;
}

// Direct case-sensitive key check
function directKeyCheck(messages: LocaleMessages, key: string): boolean {
  const parts = key.split('.');
  let current = messages;
  
  // For debugging specific keys
  const debugThisKey = DEBUG && key === 'products'; // Change this to any key you want to debug
  
  if (debugThisKey) {
    console.log(`Debug: Checking if key "${key}" exists in messages (case-sensitive)`);
    console.log(`Debug: Split into parts:`, parts);
  }
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (debugThisKey) {
      console.log(`Debug: Checking part "${part}" at level ${i}`);
      console.log(`Debug: Current object keys:`, Object.keys(current).slice(0, 20));
      if (Object.keys(current).length > 20) {
        console.log(`  ... and ${Object.keys(current).length - 20} more keys`);
      }
    }
    
    // Skip interpolated parts like '${status}'
    if (part.startsWith('${') && part.endsWith('}')) {
      if (i === parts.length - 1) {
        if (debugThisKey) console.log(`Debug: Found interpolated key at last part, returning true`);
        return true;
      }
      continue;
    }
    
    if (current[part] === undefined) {
      if (debugThisKey) console.log(`Debug: Part "${part}" not found, returning false`);
      return false;
    }
    
    if (i === parts.length - 1) {
      if (debugThisKey) console.log(`Debug: Found complete key, returning true`);
      return true;
    }
    
    if (typeof current[part] !== 'object') {
      if (debugThisKey) console.log(`Debug: Part "${part}" is not an object, returning false`);
      return false;
    }
    
    current = current[part] as LocaleMessages;
  }
  
  if (debugThisKey) console.log(`Debug: Finished traversing, returning true`);
  return true;
}

// Case-insensitive key check
function caseInsensitiveKeyCheck(messages: LocaleMessages, key: string): boolean {
  const parts = key.split('.');
  let current = messages;
  
  // For debugging specific keys
  const debugThisKey = DEBUG && key === 'products'; // Change this to any key you want to debug
  
  if (debugThisKey) {
    console.log(`Debug: Checking if key "${key}" exists in messages (case-insensitive)`);
  }
  
  for (let i = 0; i < parts.length; i++) {
    // Skip interpolated parts like '${status}'
    if (parts[i].startsWith('${') && parts[i].endsWith('}')) {
      if (i === parts.length - 1) {
        return true;
      }
      continue;
    }
    
    const part = parts[i].toLowerCase();
    const currentKeys = Object.keys(current);
    
    // Find a case-insensitive match
    const matchingKey = currentKeys.find(k => k.toLowerCase() === part);
    
    if (debugThisKey) {
      console.log(`Debug: Checking part "${part}" (case-insensitive) at level ${i}`);
      console.log(`Debug: Looking for match among keys:`, currentKeys.slice(0, 5));
      if (currentKeys.length > 5) {
        console.log(`  ... and ${currentKeys.length - 5} more keys`);
      }
      console.log(`Debug: Found matching key: ${matchingKey || 'none'}`);
    }
    
    if (!matchingKey) {
      if (debugThisKey) console.log(`Debug: No case-insensitive match found, returning false`);
      return false;
    }
    
    if (i === parts.length - 1) {
      if (debugThisKey) console.log(`Debug: Found complete key (case-insensitive), returning true`);
      return true;
    }
    
    if (typeof current[matchingKey] !== 'object') {
      if (debugThisKey) console.log(`Debug: Matching key is not an object, returning false`);
      return false;
    }
    
    current = current[matchingKey] as LocaleMessages;
  }
  
  if (debugThisKey) console.log(`Debug: Finished traversing (case-insensitive), returning true`);
  return true;
}

// Add a nested key to the messages object
function addNestedKey(messages: LocaleMessages, key: string, value: string): void {
  // Skip interpolated keys
  if (key.includes('${')) {
    return;
  }
  
  const parts = key.split('.');
  let current = messages;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    if (IGNORED_KEYS.includes(part)) {
      return; // Skip ignored keys
    }
    
    // Skip interpolated parts
    if (part.startsWith('${') && part.endsWith('}')) {
      continue;
    }
    
    if (current[part] === undefined) {
      current[part] = {};
    } else if (typeof current[part] !== 'object') {
      // Handle the case where a string value is already at this path
      current[part] = {};
    }
    
    current = current[part] as LocaleMessages;
  }
  
  const lastPart = parts[parts.length - 1];
  
  // Skip interpolated parts
  if (lastPart.startsWith('${') && lastPart.endsWith('}')) {
    return;
  }
  
  if (IGNORED_KEYS.includes(lastPart)) {
    return; // Skip ignored keys
  }
  
  current[lastPart] = value;
}

// Get a nested value from the messages object
function getNestedValue(messages: LocaleMessages, key: string): string | LocaleMessages | undefined {
  // Skip interpolated keys
  if (key.includes('${')) {
    return undefined;
  }
  
  const parts = key.split('.');
  let current = messages;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Skip interpolated parts
    if (part.startsWith('${') && part.endsWith('}')) {
      continue;
    }
    
    if (current[part] === undefined) {
      return undefined;
    }
    
    if (i === parts.length - 1) {
      return current[part];
    }
    
    if (typeof current[part] !== 'object') {
      return undefined;
    }
    
    current = current[part] as LocaleMessages;
  }
  
  return undefined;
}

// Translate text using Vercel AI
async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'user',
          content: `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text without any additional context or explanations:\n\n${text}`
        }
      ],
      temperature: 0.3,
      maxTokens: 1000,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Failed to translate text: ${error}`);
  }
}

main().catch(console.error);