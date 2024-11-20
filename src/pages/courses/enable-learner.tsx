import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import StudioLayout from "~/ui/studio/components/layout/StudioLayout";
import { api } from "~/utils/api";

// TODO: Build a process for User be enabled as Learner -- OR, finally make Learner a default upon first login.

export default function AddLearnerPage() {
  const ctx = api.useUtils();
  const { data: sessionData } = useSession();

  const { mutate: learnerCreate } = api.learner.create.useMutation({
    onSuccess: () => {
      toast.success("Ok, you are a Learner!");
      void ctx.user.getUserById.invalidate();
      void ctx.user.getUserByName.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Cannot add learner");
      } else {
        toast.error("Learner ID taken. Please try again.");
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
    <StudioLayout>
      <h1>Enable Learner</h1>
      <p className="py-3">Note</p>
      <p className="py-3">
        <Link href="#">Terms and Conditions</Link>
      </p>
      <p className="py-3">
        <Link href="#">Privacy Policy</Link>
      </p>
      {sessionData && sessionData.user.learnerId ? (
        <Link href="/studio">You&apos;re ready to Learn!</Link>
      ) : (
        <Button onClick={onEnableLearner}>Connect to Learner Features</Button>
      )}
    </StudioLayout>
  );
}
