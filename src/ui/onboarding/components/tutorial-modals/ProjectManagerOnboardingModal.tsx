import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useTerminology } from "~/contexts/terminology-context";
import Image from "next/image";

export default function ProjectManagerOnboardingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { translate, translateCaps } = useTerminology();



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center mt-5">Welcome to your first {translateCaps('escrow')}</DialogTitle>
          <DialogDescription className="space-y-3">
            <Image src="/andamio.png" width={150} height={150} alt="andamio" className="mx-auto" />
            <p>
              On this page, you can add tasks to your new project.
            </p>
            <p>
              When you are ready, continue the tutorial to learn how to:
            </p>
            <ul className="list-disc pl-6 pt-2">
              <li>Sett up Contributor Prerequisites</li>
              <li>Create standardized Acceptance Criteria</li>
              <li>Connect your project to the Andamio Network</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-8">
          <Button onClick={onClose}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
