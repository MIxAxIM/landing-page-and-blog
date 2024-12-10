import { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";
import { EditableCodeBlock } from "~/components/editor/extensions/CodeBlock";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";

export default function useTaskCommitmentEditor(
  taskId: string,
  editable: boolean,
) {
  const { taskCommitment } = useTaskCommitment({ taskId });
  const editor = useEditor({
    extensions: [...ExtensionKit(), EditableCodeBlock],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full text-foreground prose-headings:text-foreground",
      },
    },
    editable,
  });

  // Set content when taskCommitment updates
  useEffect(() => {
    if (
      taskCommitment &&
      taskCommitment.evidence &&
      typeof taskCommitment.evidence === "object" &&
      editor
    ) {
      editor.commands.setContent(taskCommitment.evidence);
    }
  }, [taskCommitment, editor]);

  // Update editability dynamically
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  return { editor, taskId, taskCommitment };
}
