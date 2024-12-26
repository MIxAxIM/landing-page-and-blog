import { api } from "~/utils/api";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";
import useIntroduction from "~/hooks/db/course/useIntroduction";
import { useEffect } from "react";

export default function useIntroEditor(courseModuleId: string) {
  const ctx = api.useUtils();
  const { introduction, refetchIntro, isLoadingIntro } =
    useIntroduction(courseModuleId);
  const editor = useEditor({
    extensions: [...ExtensionKit()],
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
      introduction &&
      introduction.contentJson &&
      typeof introduction.contentJson === "object" &&
      editor
    ) {
      editor?.commands.setContent(introduction?.contentJson);
    }
  }, [introduction, editor]);

  return { editor, introduction, refetchIntro, isLoadingIntro, ctx };
}
