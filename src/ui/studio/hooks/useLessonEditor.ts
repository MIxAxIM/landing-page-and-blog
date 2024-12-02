import { api } from "~/utils/api";
import useLesson from "~/hooks/db/course/useLesson";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";
import { useEffect } from "react";
// import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { EditableCodeBlock } from "~/components/editor/extensions/CodeBlock";

export default function useLessonEditor(
  courseCode: string,
  moduleCode: string,
  moduleIndex: number,
) {
  const ctx = api.useUtils();
  const { lesson, refetchLesson, isLoadingLesson } = useLesson(
    courseCode,
    moduleCode,
    moduleIndex,
  );
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
      lesson &&
      lesson.contentJson &&
      typeof lesson.contentJson === "object" &&
      editor
    ) {
      editor?.commands.setContent(lesson.contentJson);
    }
  }, [lesson, editor]);

  return { editor, lesson, refetchLesson, isLoadingLesson, ctx };
}
