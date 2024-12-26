import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { type Course, type User } from "~/types/db";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import DialogForm from "~/components/form/dialog-form";
import Image from "next/image";

// TODO: Update this component
// Make sprint task to update this component to match new patterns:
// 1. ShadCN components - or at least check on deprecated Combobox components below
// 2. Consider making useQuery into a hook?
// -> Is it likely we'll want to re-use this logic? Is there any risk to performance in the Combobox?
//
export default function DialogCourseManager({
  dialogOpen,
  setDialogOpen,
  course,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  course: Course;
}) {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<User | null>(null);

  // Make a hook?
  const { data: searchUsers } = api.user.getUserByName.useQuery({
    username: query,
  });
  const filteredPeople = query === "" ? [] : (searchUsers ?? []);

  const ctx = api.useUtils();

  const { handleSubmit } = useForm();

  const { mutate, isLoading: isLoadingAddCourseManager } =
    api.course.addCourseContributor.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("Course manager added!");
        void ctx.course.getCoursesByOwner.invalidate();
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

  function onSubmit() {
    if (course && selectedPerson) {
      mutate({
        courseCode: course.courseCode,
        creatorId: selectedPerson.id,
      });
    }
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <DialogForm
      openButton="Add Course Contributor"
      openButtonIntent="dialog"
      title="Add Course Contributor"
      buttonLabel="Add"
      buttonDisabled={selectedPerson === null}
      buttonLoading={isLoadingAddCourseManager}
      handleSubmit={handleSubmit(() => onSubmit())}
      isOpen={dialogOpen}
      setIsOpen={setDialogOpen}
    >
      <p>A Contributor can add and edit Modules, Assignments and Lessons.</p>

      <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-background py-1.5 pl-3 pr-12 text-foreground shadow-sm ring-1 ring-inset ring-accent-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            //@ts-expect-error todo how to fix this
            displayValue={(person: User) => person?.name}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredPeople.length > 0 && (
            <Combobox.Options className="z-100 ringforeground absolute mt-1 max-h-56 w-full overflow-auto rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm">
              {searchUsers &&
                searchUsers.map((person) => {
                  return (
                    <Combobox.Option
                      key={person.id}
                      value={person}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground",
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <div className="flex items-center">
                            {person.image && (
                              <Image
                                width={40}
                                height={40}
                                src={person.image}
                                alt=""
                                className="h-6 w-6 flex-shrink-0 rounded-full"
                              />
                            )}
                            <span
                              className={classNames(
                                "ml-3 truncate",
                                selected ? "font-semibold" : "",
                              )}
                            >
                              {person.name}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active
                                  ? "text-primary-foreground"
                                  : "text-primary",
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  );
                })}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </DialogForm>
  );
}
