'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, AlignLeft, AlignCenter,
    AlignRight, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Heading3, Undo, Redo
} from 'lucide-react';

import { Editor } from '@tiptap/react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt('Image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bold') ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('italic') ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('underline') ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <UnderlineIcon className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <Heading1 className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <Heading2 className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <Heading3 className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bulletList') ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <List className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('orderedList') ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <ListOrdered className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <AlignLeft className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <AlignCenter className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-white text-primary shadow-sm' : ''}`}
            >
                <AlignRight className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button type="button" onClick={setLink} className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('link') ? 'bg-white text-primary shadow-sm' : ''}`}>
                <LinkIcon className="h-4 w-4" />
            </button>
            <button type="button" onClick={addImage} className="p-2 rounded hover:bg-white transition-colors">
                <ImageIcon className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-white transition-colors">
                <Undo className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-white transition-colors">
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image,
        ],
        immediatelyRender: false,
        content: content,
        onUpdate: ({ editor }: { editor: Editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-6',
            },
        },
    });

    return (
        <div className="w-full bg-white rounded-2xl overflow-hidden border">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
