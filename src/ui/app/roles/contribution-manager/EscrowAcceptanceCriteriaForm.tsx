import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { useState } from "react";
import { useTerminology } from "~/contexts/terminology-context";

const FormSchema = z.object({
  newCriterion: z.string().min(1, "Criterion text is required"),
});

type FormValues = z.infer<typeof FormSchema>;

interface EscrowAcceptanceCriteriaFormProps {
  escrowId: string;
}

export default function EscrowAcceptanceCriteriaForm({
  escrowId,
}: EscrowAcceptanceCriteriaFormProps) {
  // Get escrow data and mutation
  const { escrow, updateEscrow, isUpdating } = useEscrow({ id: escrowId });
  const { translateCaps, translate } = useTerminology()

  // Track which criterion is being edited
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form for adding new criteria
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newCriterion: "",
    },
  });

  const savedCriteria = escrow?.savedAcceptanceCriteria ?? [];

  const handleRemoveCriterion = (index: number) => {
    if (!escrow) return;

    const newCriteria = savedCriteria.filter((_, i) => i !== index);

    updateEscrow({
      id: escrowId,
      title: escrow.title ?? "",
      savedAcceptanceCriteria: newCriteria,
      isSyncedWithNetwork: false,
    });
  };

  const handleEditCriterion = (index: number, newValue: string) => {
    if (!escrow) return;

    const newCriteria = [...savedCriteria];
    newCriteria[index] = newValue;

    updateEscrow({
      id: escrowId,
      title: escrow.title ?? "",
      savedAcceptanceCriteria: newCriteria,
      isSyncedWithNetwork: false,
    });

    setEditingIndex(null);
  };

  const onSubmit = (data: FormValues) => {
    if (!escrow) return;

    const newCriteria = [...savedCriteria, data.newCriterion];

    updateEscrow({
      id: escrowId,
      title: escrow.title ?? "",
      savedAcceptanceCriteria: newCriteria,
      isSyncedWithNetwork: false,
    });

    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* Existing Criteria */}
      <div className="space-y-2">
        <h3>Saved Acceptance Criteria</h3>
        <p className="text-sm text-muted-foreground">
          You can still customize {translate('acceptanceCriteria')} in each individual task
        </p>

        <div className="space-y-2">
          {savedCriteria.map((criterion, index) => (
            <div key={index} className="flex items-center gap-2">
              {editingIndex === index ? (
                <FormInput
                  form={form}
                  name={`criterion-${index}`}
                  defaultValue={criterion}
                  onBlur={(e) => handleEditCriterion(index, e.target.value)}
                  autoFocus
                />
              ) : (
                <>
                  <p className="flex-1">{criterion}</p>
                  {/* TODO: Implement something like RowSLT here? */}
                  {/* <Button */}
                  {/*   type="button" */}
                  {/*   size="sm" */}
                  {/*   intent="secondary" */}
                  {/*   onClick={() => setEditingIndex(index)} */}
                  {/*   disabled={isUpdating} */}
                  {/* > */}
                  {/*   Edit */}
                  {/* </Button> */}
                  <Button
                    type="button"
                    size="sm"
                    intent="destructive"
                    onClick={() => handleRemoveCriterion(index)}
                    disabled={isUpdating}
                  >
                    Remove
                  </Button>
                </>
              )}
            </div>
          ))}

          {savedCriteria.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No saved {translate('acceptanceCriteria')} yet. Add some below.
            </p>
          )}
        </div>
      </div>

      {/* Add New Criterion Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="newCriterion"
            label="Add New Criterion"
            form={form}
            placeholder={`Enter new ${translateCaps('acceptanceCriteria')}`}
          />
          <Button type="submit" disabled={isUpdating} className="w-full">
            Add Criterion
          </Button>
        </form>
      </Form>
    </div>
  );
}
