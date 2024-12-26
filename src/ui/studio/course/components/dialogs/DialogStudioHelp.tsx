import { Dialog, DialogTrigger, DialogContent } from "~/components/ui/dialog";

export default function DialogStudioHelp() {
  return (
    <Dialog>
      <DialogTrigger className="pl-3 text-xs font-semibold text-accent">
        Help
      </DialogTrigger>
      <DialogContent>
        <p className="py-2 text-xs font-bold">Add a Link</p>
        <p className="pb-2 text-xs">
          When you highlight text and paste a URL from your clipboard, the
          highlighted text will become a link.
        </p>
        <p className="py-2 text-xs font-bold">Add an Image</p>
        <p className="pb-2 text-xs">
          To insert an image, use a &quot;slash&quot; command. In the editor,
          type <span className="font-mono">{"/image"}</span>. Then, when an
          image container appears, you can drag and drop an image from your
          computer into the Andamio editor.
        </p>
        <p className="py-2 text-xs font-bold">Try Andamio AI</p>
        <p className="pb-2 text-xs">
          From the menu bar, you can experiment with Andamio AI. Right now it
          offers one feature: from a Student Learning Target, you can generate a
          set of suggested sub-headings to help you start writing a lesson.
        </p>
        <p className="pb-2 text-xs">
          More features will roll out in the coming months.
        </p>
      </DialogContent>
    </Dialog>
  );
}
