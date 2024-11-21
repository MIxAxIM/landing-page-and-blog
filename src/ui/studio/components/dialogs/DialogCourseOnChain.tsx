import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { useCallback, useEffect } from "react";
import { type Course, type CourseOnChainInstance } from "~/types/db";
import { Network } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";

export default function DialogCourseOnChain({
  dialogOpen,
  setDialogOpen,
  course,
  courseOnchain,
  selectedNetwork,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  course: Course;
  courseOnchain?: CourseOnChainInstance;
  selectedNetwork: Network;
}) {
  const ctx = api.useUtils();

  const { mutate: create, isLoading: isLoadingCreate } =
    api.courseOnChainInstance.create.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("New on-chain configs added!");
        void ctx.courseOnChainInstance.getCourseOnchainInstances.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Course On-Chain Instance error. Please try again.");
        }
      },
    });

  const { mutate: update, isLoading: isLoadingUpdate } =
    api.courseOnChainInstance.update.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("Course updated!");
        void ctx.courseOnChainInstance.getCourseOnchainInstances.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });

  // Todo: Add validation for CS, Addr, and UTxO types
  const FormSchema = z.object({
    network: z.nativeEnum(Network),
    CourseCreatorNFTPolicyID: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      network: "PREPROD",
      CourseCreatorNFTPolicyID: "",
    },
  });

  function onSubmit(data: FieldValues) {
    console.log(data);

    if (!course) return;

    if (courseOnchain && courseOnchain.id) {
      update({
        id: courseOnchain.id,
        network: data.network,
        CourseCreatorNFTPolicyID: data.CourseCreatorNFTPolicyID,
      });
    } else {
      const _data = {
        courseCode: course.courseCode,
        network: selectedNetwork,
        CourseCreatorNFTPolicyID: data.CourseCreatorNFTPolicyID,
      };
      create(_data);
    }
  }

  const resetForm = useCallback(() => {
    form.reset({
      network: courseOnchain?.network ?? "PREPROD",
      CourseCreatorNFTPolicyID: courseOnchain?.CourseCreatorNFTPolicyID ?? "",
    });
  }, [form, courseOnchain]);

  useEffect(() => {
    if (dialogOpen && courseOnchain) {
      resetForm();
    }
  }, [dialogOpen, courseOnchain, resetForm]);

  return (
    <Form {...form}>
      <DialogForm
        openButton={
          courseOnchain ? "Update Network Config" : "Add Network Config"
        }
        openButtonIntent="dialog"
        title={
          courseOnchain
            ? `Editing On-Chain Course Config ${courseOnchain.course.courseCode} ${courseOnchain.network} (${courseOnchain?.id})`
            : "On-Chain Course Config"
        }
        buttonLabel={courseOnchain ? "Save" : "Create"}
        buttonLoading={isLoadingCreate || isLoadingUpdate}
        buttonDisabled={isLoadingCreate || isLoadingUpdate}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
      >
        {courseOnchain && courseOnchain ? (
          <div className="mt-4 grid grid-cols-1 gap-y-4">
            <p className="text-xl font-bold">Network: {selectedNetwork}</p>
            <FormInput
              name="CourseCreatorNFTPolicyID"
              label="CourseCreatorNFTPolicyID"
              form={form}
            />
            <p>Onchain Instance Id: {courseOnchain.id}</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-y-4">
            <p className="text-xl font-bold">Network: {selectedNetwork}</p>
            <FormInput
              name="CourseCreatorNFTPolicyID"
              label="CourseCreatorNFTPolicyID"
              form={form}
            />
          </div>
        )}
      </DialogForm>
    </Form>
  );
}
