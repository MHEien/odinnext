'use client';

import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b pb-2 mb-4 flex flex-wrap gap-2 items-center bg-white sticky top-0 z-10 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button" 
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <span className="italic">I</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <span className="underline">U</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
        title="Heading 3"
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        title="Ordered List"
      >
        1. List
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        title="Link"
      >
        Link
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-100"
        title="Image"
      >
        Image
      </button>
      <input
        type="color"
        onInput={(event) => {
          editor.chain().focus().setColor((event.target as HTMLInputElement).value).run();
        }}
        className="w-8 h-8 rounded border cursor-pointer"
        title="Text Color"
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-100 ml-auto"
        title="Undo"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Redo"
      >
        Redo
      </button>
    </div>
  );
};

const VariableMenu = ({ onInsertVariable }: { onInsertVariable: (variable: string) => void }) => {
  const variables = [
    { name: 'title', description: 'Newsletter title' },
    { name: 'content', description: 'Main content' },
    { name: 'year', description: 'Current year' },
    { name: 'unsubscribe', description: 'Unsubscribe link' },
    { name: 'first_name', description: 'Recipient first name' },
    { name: 'last_name', description: 'Recipient last name' },
    { name: 'cta_url', description: 'Call to action URL' },
    { name: 'cta_text', description: 'Call to action text' },
    { name: 'logo_url', description: 'Company logo URL' },
    { name: 'featured_section_title', description: 'Featured products section title' },
    { name: 'product1_image', description: 'Featured product 1 image' },
    { name: 'product1_name', description: 'Featured product 1 name' },
    { name: 'product1_price', description: 'Featured product 1 price' },
    { name: 'product2_image', description: 'Featured product 2 image' },
    { name: 'product2_name', description: 'Featured product 2 name' },
    { name: 'product2_price', description: 'Featured product 2 price' },
    { name: 'product3_image', description: 'Featured product 3 image' },
    { name: 'product3_name', description: 'Featured product 3 name' },
    { name: 'product3_price', description: 'Featured product 3 price' },
  ];

  return (
    <div className="border rounded-md p-4 mb-4 bg-stone-50">
      <h3 className="font-medium mb-2">Insert Variable:</h3>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable.name}
            type="button"
            onClick={() => onInsertVariable(`{{${variable.name}}}`)}
            className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm hover:bg-primary-200 transition-colors"
            title={variable.description}
          >
            {variable.name}
          </button>
        ))}
      </div>
    </div>
  );
};

interface EmailEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
}

export default function EmailEditor({ initialHtml = '', onChange }: EmailEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start designing your email...',
      }),
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML();
      setHtml(newHtml);
      onChange(newHtml);
    },
  });

  const handleInsertVariable = (variable: string) => {
    if (editor) {
      editor.chain().focus().insertContent(variable).run();
    }
  };

  // Update editor content when initialHtml changes
  useEffect(() => {
    if (editor && initialHtml !== html) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml, html]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white"
      >
        <div className="bg-stone-50 p-4 border-b">
          <h3 className="font-medium">Email Template Editor</h3>
          <p className="text-sm text-stone-500">Design your custom email template</p>
        </div>
        
        <VariableMenu onInsertVariable={handleInsertVariable} />
        
        <MenuBar editor={editor} />
        
        <div className="p-4 min-h-[400px] bg-white">
          <EditorContent editor={editor} className="prose max-w-none h-full min-h-[350px]" />
        </div>
        
        <div className="bg-stone-50 p-4 border-t">
          <div className="flex justify-between">
            <div className="text-sm text-stone-500">
              {html.length} characters
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 