import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";
import ContentEditor from "~/ui/studio/components/ContentEditor";

export default function ChatPage() {
  const editor = useEditor({
    extensions: [...ExtensionKit()],
    content: "Write lesson content here...",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full bg-background text-foreground prose-headings:text-foreground",
      },
    },
  });

  if (editor) return <ContentEditor editor={editor} />;
  return <div>Loading...</div>;
}
