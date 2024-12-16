import { useEffect } from "react";
import { Content, useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";
import { EditableCodeBlock } from "~/components/editor/extensions/CodeBlock";
import { AssignmentCommitment, TaskCommitment } from "~/types/db";

export default function useTaskCommitmentEditor({
  taskCommitment,
  assignmentCommitment,
  editable
}: {
  taskCommitment?: TaskCommitment,
  assignmentCommitment?: AssignmentCommitment,
  editable: boolean
}) {
  const editor = useEditor({
    extensions: [...ExtensionKit(), EditableCodeBlock],
    // Start with empty content, we'll set it after parsing
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full text-foreground prose-headings:text-foreground",
      },
    },
    editable,
  });

  // Set content when taskCommitment updates...
  useEffect(() => {
    if (taskCommitment?.evidence && editor) {
      try {
        const content = taskCommitment.evidence as Content
        editor.commands.setContent(content);
      } catch (error) {
        console.error('Failed to load content json:', error);
        // Optionally set some fallback content or show an error
        editor.commands.setContent('');
      }
    }
  }, [taskCommitment, editor]);

  // ...or when assignmentCommitment updates
  useEffect(() => {
    if (assignmentCommitment?.networkEvidence && editor) {
      try {
        const content = assignmentCommitment.networkEvidence as Content
        editor.commands.setContent(content);
      } catch (error) {
        console.error('Failed to load content json:', error);
        // Optionally set some fallback content or show an error
        editor.commands.setContent('');
      }
    }
  }, [assignmentCommitment, editor]);

  // Update editability dynamically
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  return { editor, taskCommitment, assignmentCommitment };
}
