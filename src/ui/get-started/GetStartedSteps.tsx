import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { api } from "~/utils/api";
import { BoxIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import Loading from "~/components/common/loading";
import ViewCoursesButton from "../landing/ViewCoursesButton";

export default function GetStartedSteps() {
  const { data: sessionData } = useSession();

  // ok make some buttons so that user can become
  // then test it
  // then nuke the db

  // any time left? ok look at UI components...

  const { mutate: learnerCreate } = api.learner.create.useMutation({
    onSuccess: () => {
      toast.success("Ok, you are a Learner!");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Some SLT inputs are missing or invalid");
      } else {
        toast.error("SLT ID taken. Please try again.");
      }
    },
  });

  function onEnableLearner() {
    if (sessionData) {
      learnerCreate({
        userId: sessionData.user.id,
      });
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col pt-12">
      <h2>
        Get Started
      </h2>
      <div className="mx-auto my-3 w-full md:w-2/3">
        <div className="grid grid-cols-1 gap-12">
          <Card size="md" className="border-none bg-accent shadow-xl">
            <CardHeader>
              <h2>
                Step 1: Log into Andamio with Discord
              </h2>
            </CardHeader>
            <CardContent>
              <p className="prose mx-auto text-left text-lg leading-8">
                Anyone can <Link href="/course">browse course for free</Link>{" "}
                on Andamio. To start interacting with the platform, you must
                create an account. To create an account, log in with Discord.
              </p>

              {sessionData?.user.name ? (
                <>
                  <h2>Success!</h2>
                  <div className="mt-5 flex w-full flex-row items-center gap-10 px-5">
                    <CheckCircledIcon className="h-[50px] w-[50px] rounded-full bg-success-foreground" />
                    <p className="prose text-left text-lg leading-8">
                      You are currently logged in with Discord account:{" "}
                      {sessionData.user.name}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-5 flex flex-col items-center gap-5 md:flex-row">
                  <Link href="/auth/signin">
                    <Button>Log In with Discord</Button>
                  </Link>
                  <ViewCoursesButton />
                </div>
              )}
            </CardContent>
          </Card>
          <Card size="md" className="border-none bg-accent shadow-xl">
            <CardHeader>
              <h2>
                Step 2: Activate Learner Status
              </h2>
            </CardHeader>
            <CardContent>
              <div>
                {sessionData?.user.learnerId ? (
                  <>
                    <h2>Success!</h2>
                    <div className="mt-5 flex w-full flex-row items-center gap-10 px-5">
                      <CheckCircledIcon className="h-[50px] w-[50px] rounded-full bg-success-foreground" />
                      <p className="prose text-left text-lg leading-8">
                        Welcome! You now have Learner access to Andamio.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="prose mx-auto text-left text-lg leading-8">
                      To start learning in Andamio, you must first enable the
                      learner role. Just tap this button:
                    </p>
                    <Suspense fallback={<Loading />}>
                      <div className="mt-5 flex flex-col items-center justify-between md:flex-row">
                        {!!sessionData?.user ? (
                          <Button onClick={onEnableLearner}>
                            Enable Learner Role
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              alert(
                                "To enable your Learner Account, please log in with Discord.",
                              )
                            }
                          >
                            Enable Learner Role
                          </Button>
                        )}
                      </div>
                    </Suspense>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          <Card size="md" className="border-none bg-accent shadow-xl">
            <CardHeader>
              <h2>
                Step 3: Getting Started With Andamio Course
              </h2>
            </CardHeader>
            <CardContent>
              <div>
                <p className="prose mx-auto text-left text-lg leading-8">
                  The best way to learn about Andamio is by using it. The
                  &quot;Getting Started with Andamio&quot; provides a quick tour
                  of everything you need to know.
                </p>
                {sessionData?.user.learnerId && (
                  <>
                    <h2>Ready?</h2>
                    <div className="mt-5 flex w-full flex-row items-center gap-10 px-5">
                      <BoxIcon className="h-[50px] w-[50px] rounded-md bg-secondary" />
                      <p className="prose text-left text-lg font-bold leading-8 underline">
                        <Link href="/course/andamio101">
                          Course: Getting Started With Andamio
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card
            size="md"
            className="border-none bg-success-foreground shadow-xl"
          >
            <CardHeader>
              <h2>Next Steps</h2>
            </CardHeader>
            <CardContent>
              <div className="flex w-full flex-col items-center justify-center">
                <div className="mb-5 text-center">
                  <p className="prose mx-auto mb-2 text-lg font-semibold leading-8">
                    Keep Learning:
                  </p>
                  <Link href="/course">
                    <Button>Explore All course on Andamio</Button>
                  </Link>
                </div>
                <div className="mb-5 text-center">
                  <p className="prose mx-auto mb-2 text-lg font-semibold leading-8">
                    Want to build a course?
                  </p>
                  <Link href="/contact">
                    <Button>Get in Touch</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
