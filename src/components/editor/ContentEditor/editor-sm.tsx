import { type Editor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import { AndamioBubbleMenu } from "~/components/editor/components/menus/AndamioBubbleMenus";
import { usePaste } from "~/components/editor/extensions/ImageUpload/view/hooks";

export default function ContentEditorSm({
  editor,
  editable = true,
}: {
  editor: Editor;
  editable: boolean;
}) {
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
      className="mx-2 w-full overflow-y-auto border"
      onClick={handleClick}
    >
      <div className="mx-auto my-4">
        <div className={`m-5 mx-auto flex w-11/12 flex-col pb-5 shadow-xl ${editable ? 'bg-white' : 'bg-slate-300'}`}>
          <div className="flex w-full p-5 lg:p-8">
            <AndamioBubbleMenu editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
