import { type FieldValues } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent } from "~/components/ui/dialog";
import VideoLink from "../form-sections/VideoLink";
import { Button } from "~/components/ui/button";

export default function DialogAddVideoLink({
  form,
  onSubmit,
}: {
  form: FieldValues;
  onSubmit: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger className="px-3 text-xs font-semibold">
        Add Video
      </DialogTrigger>
      <DialogContent>
        <h2>Add a Video to this Lesson</h2>
        <p>The video will be displayed at the top of the course page.</p>
        <VideoLink form={form} />
        <Button onClick={() => onSubmit()}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
