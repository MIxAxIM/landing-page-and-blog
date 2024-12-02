import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { api } from "~/utils/api";

const latestTncVersion = "1.0.0";

export default function TncDialog() {
  const ctx = api.useUtils();
  const { data: sessionData, update: updateSession } = useSession();

  const [mustApproveTnc, setMustApproveTnc] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: updateTncVersion } =
    api.user.updateUserTncVersion.useMutation({
      onSuccess: async () => {
        void ctx.user.getUserById.invalidate();
        void ctx.user.getUserByName.invalidate();
        setIsOpen(false);
        setMustApproveTnc(false);
        await updateSession();
      },
      onError: (e) => {
        console.log(e);
      },
    });

  useEffect(() => {
    if (
      !!sessionData?.user &&
      sessionData.user.tncVersion != latestTncVersion
    ) {
      setIsOpen(true);
      setMustApproveTnc(true);
    } else if (!!sessionData?.user && !sessionData?.user.tncVersion) {
      setIsOpen(true);
      setMustApproveTnc(true);
    }
  }, [sessionData?.user.tncVersion, sessionData?.user]);

  function handleApprovalClick() {
    if (sessionData?.user) {
      updateTncVersion({
        userId: sessionData.user.id,
        tncVersion: latestTncVersion,
      });
    }
  }

  if (!sessionData || !mustApproveTnc) return;

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader className="font-bold">
          Changes to Terms and Conditions + Privacy Policy
        </DialogHeader>
        <div className="text-sm text-secondary-foreground">
          Terms and Conditions Version 1.0.0
        </div>

        <p className="text-sm text-secondary-foreground">
          Andamio Version 0.2.21
        </p>

        <p className="py-1 font-medium">
          Thank you for supporting Andamio as we continue to build it.
        </p>
        <p className="py-1 font-medium">
          You are currently viewing a pre-release version of Andamio. The
          platform is evolving rapidly, so please expect changes.
        </p>
        <p className="py-1 font-medium">
          Please review the updated Andamio Terms and Conditions and Privacy
          Policy:
        </p>
        <ul className="mb-8 ml-5 list-disc">
          <li className="py-1 text-indigo-900 underline">
            Terms and Conditions
          </li>
          <li className="py-1 text-indigo-900 underline">Privacy Policy</li>
        </ul>
        <Button onClick={handleApprovalClick}>OK</Button>
      </DialogContent>
    </Dialog>
  );
}
