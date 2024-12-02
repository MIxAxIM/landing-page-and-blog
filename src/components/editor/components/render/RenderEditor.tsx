import { useEditor, EditorContent, type Content } from "@tiptap/react";
import { useEffect } from "react";
import { ExtensionKit } from "../../extension-kit";
import { EditableCodeBlock } from "../../extensions/CodeBlock";

interface EditorProps {
  editable?: boolean;
  initialContent?: Content;
  index?: string;
}

export default function RenderEditor({
  editable = true,
  initialContent = "This content is not yet available.",
  index,
}: EditorProps) {
  const editor = useEditor({
    extensions: [...ExtensionKit(), EditableCodeBlock],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full bg-background text-foreground prose-headings:text-foreground",
      },
    },
    editable: editable,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div className="mx-auto flex h-full w-full flex-col overflow-hidden bg-background text-foreground">
      <EditorContent key={index} editor={editor} />
    </div>
  );
}
