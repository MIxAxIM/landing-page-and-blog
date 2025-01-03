import { api } from "~/utils/api";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";

export default function useAssignmentEditor() {
  const ctx = api.useUtils();

  const editor = useEditor({
    extensions: [...ExtensionKit()],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full text-foreground prose-headings:text-foreground",
      },
    },
  });
  return { editor, ctx };
}
