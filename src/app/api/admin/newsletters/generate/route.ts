import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { model } from '@/lib/ai';
import { CoreMessage, streamText } from 'ai';

const systemPrompt = `You are an expert email template designer specializing in creating HTML email templates for newsletters. 
You understand email best practices, responsive design, and how to create visually appealing content.

The brand you're working with has a Norse-inspired aesthetic with these colors:
- Deep brown (#78350f) as primary
- Gold/bronze (#c19a6b) as accent
- Charcoal (#33292e) for darker elements
- Light cream (#fafaf6) for backgrounds

When creating email templates:
- Use clean, responsive HTML with inline CSS
- Create a balanced design with adequate white space
- Ensure good contrast for readability
- Include template variables in {{double braces}} format
- Include appropriate header and footer elements
- Support dark themes and light themes
- Make the design mobile-friendly

Only provide the complete HTML email template code, nothing else.`;

export async function POST(req: Request) {
  console.log('[NEWSLETTER/GENERATE] Processing template generation request');
  
  try {
    // Check admin authentication
    console.log('[NEWSLETTER/GENERATE] Verifying user authentication');
    const session = await auth();
    if (!session?.user) {
      console.warn('[NEWSLETTER/GENERATE] Authentication failed - no session found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log(`[NEWSLETTER/GENERATE] User authenticated: ${session.user.id}`);
    
    // Access check (admin only)
    console.log('[NEWSLETTER/GENERATE] Checking user permissions');
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    
    if (user?.role !== 'ADMIN') {
      console.warn(`[NEWSLETTER/GENERATE] Permission denied - user role: ${user?.role}`);
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }
    
    console.log('[NEWSLETTER/GENERATE] Admin access verified');

    // Parse the request body to get the prompt
    console.log('[NEWSLETTER/GENERATE] Parsing request body');
    const { prompt } = await req.json();
    
    if (!prompt) {
      console.warn('[NEWSLETTER/GENERATE] Missing required prompt in request body');
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    console.log('[NEWSLETTER/GENERATE] Prompt received, preparing AI request');

    // Prepare the messages for the OpenAI API
    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Generate the HTML template with OpenAI using streamText
    console.log('[NEWSLETTER/GENERATE] Sending request to AI model');
    console.time('[NEWSLETTER/GENERATE] AI template generation time');
    
    const response = await streamText({
      model,
      messages,
      temperature: 0.7,
    });
    
    console.log('[NEWSLETTER/GENERATE] Stream created successfully');
    console.log("response", response);
    // Use toDataStreamResponse as recommended in AI SDK 4.0
    return response.toDataStreamResponse();
    
  } catch (error) {
    // Enhanced error logging
    console.error('[NEWSLETTER/GENERATE] Error generating email template:', error);
    
    // Log stack trace if available
    if (error instanceof Error) {
      console.error('[NEWSLETTER/GENERATE] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 