import { type FieldValues } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import FormTextArea from "~/components/form/form-textarea";

export default function DialogCreatorNotes({
  form,
  onSubmit,
}: {
  form: FieldValues;
  onSubmit: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger className="px-3 text-xs font-semibold">
        My Notes
      </DialogTrigger>
      <DialogContent>
        <h2>Keep private notes about this lesson</h2>
        <p>
          Your notes will be visible to anyone who has creator-access to this
          course, but not to students.
        </p>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <FormTextArea
              name="description"
              placeholder="My notes"
              className="min-h-[500px]"
              form={form}
            />
          </div>
        </div>
        <Button onClick={() => onSubmit()}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
