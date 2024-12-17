import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import FormLabel from "~/components/form/form-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import useCourses from "~/hooks/db/course/useCourses";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import InitCourse from "./InitCourse";

export default function InitCourseDialog() {
  const address = useAddress();
  const { courses } = useCourses();
  const [creatorAliasToAdd, setCreatorAliasToAdd] = useState<string | undefined>(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    creatorAlias: z.string().min(2, {
      message: "Token name must be at least 2 characters.",
    }),
    courseId: z.string().min(1, {
      message: "Course selection is required",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      creatorAlias: "",
      courseId: "",
    },
  });

  const { register, watch } = form;

  const tokenAlias = watch("creatorAlias");
  const courseId = watch("courseId");

  function onSubmit() {
    if (tokenAlias.length > 1) {
      setCreatorAliasToAdd(tokenAlias);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Create a New Course NFT</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Mint Access Token"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h2>
              Step 1: Mint and Lock Course NFT
            </h2>
            {/* About this Module */}
            <h2>About</h2>
            <p className="mb-5">Feature: Tell what is happening at this step</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel>Your Andamio Network Token Name:</FormLabel>
                <FormInput
                  {...register("creatorAlias")}
                  name="creatorAlias"
                  placeholder="Choose your token name"
                  form={form}
                />

                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a Course to Publish On-Chain</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses?.map(course => (
                            <SelectItem value={course.id} key={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button className="mt-8">Submit</Button>
              </form>
            </Form>
            {address && creatorAliasToAdd && (
              <>
                <InitCourse
                  alias={creatorAliasToAdd}
                  courseId={courseId}
                  setSuccessTxHash={setSuccessTxHash}
                />
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
