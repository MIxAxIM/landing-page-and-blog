import { type Editor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import { AndamioBubbleMenu } from "~/components/editor/components/menus/AndamioBubbleMenus";
import { usePaste } from "~/components/editor/extensions/ImageUpload/view/hooks";

export default function ContentEditorSm({ editor }: { editor: Editor }) {
  const handleClick = () => {
    if (editor) {
      editor.chain().focus().run();
    }
  };

  const { onPaste } = usePaste({ editor: editor });

  useEffect(() => {
    document.addEventListener("paste", onPaste);

    return () => {
      document.removeEventListener("paste", onPaste);
    };
  }, [onPaste]);

  return (
    <div
      className="mx-2 h-96 w-full overflow-y-auto border"
      onClick={handleClick}
    >
      <div className="mx-auto my-4">
        <div className="m-5 mx-auto flex min-h-[90vh] w-11/12 flex-col bg-white pb-5 shadow-xl">
          <div className="flex w-full p-5 lg:p-8">
            <AndamioBubbleMenu editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
