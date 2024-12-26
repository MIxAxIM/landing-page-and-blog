import { type FieldValues } from "react-hook-form";
import FormSwitch from "~/components/form/form-switch";

export default function PublishToggle({
  form,
  title,
}: {
  form: FieldValues;
  title: string;
}) {
  return (
    <div className="col-span-4 rounded-md border border-secondary-foreground p-5">
      <FormSwitch
        name="live"
        label="Publish"
        form={form}
        info={`Use this toggle to publish content. When content is published, everyone enrolled in ${title} will be able to see it.`}
      />
    </div>
  );
}
