import { api } from "~/utils/api";
import useLesson from "~/hooks/db/course/useLesson";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";
import { useEffect } from "react";
// import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { EditableCodeBlock } from "~/components/editor/extensions/CodeBlock";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";

export default function useTaskCommitmentEditor(
  taskId: string,
) {
  const ctx = api.useUtils();

  const { taskCommitment } = useTaskCommitment({ taskId: taskId })
  const editor = useEditor({
    extensions: [...ExtensionKit(), EditableCodeBlock],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full bg-background text-foreground prose-headings:text-foreground",
      },
    },
  });

  useEffect(() => {
    if (
      taskCommitment &&
      taskCommitment.evidence &&
      typeof taskCommitment.evidence === "object" &&
      editor
    ) {
      editor?.commands.setContent(taskCommitment.evidence);
    }
  }, [taskCommitment, editor]);

  return { editor, taskId, taskCommitment, ctx };
}
