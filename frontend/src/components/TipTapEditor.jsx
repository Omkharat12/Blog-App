import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

const TipTapEditor = ({ setFormData, formData }) => {


    const editor = useEditor({
        extensions: [StarterKit],
        content: formData?.content || '',
        editorProps: {
            attributes: {
                class: 'prose p-3 min-h-[18rem] outline-none',
            },
        },
        onUpdate({ editor }) {
            setFormData((prev) => ({
                ...prev,
                content: editor.getHTML(),
            }));
        },
    });

    // Update content if `formData.content` changes (e.g. after fetch)
    useEffect(() => {
        if (editor && formData.content !== editor.getHTML()) {
            editor.commands.setContent(formData.content || '');
        }
    }, [formData.content, editor]);

    return (
        <div className="border rounded-md dark:bg-gray-800">
            <EditorContent editor={editor} />
        </div>
    );
};

export default TipTapEditor;
