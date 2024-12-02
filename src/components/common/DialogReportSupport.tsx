import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export function DialogReportSupport() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReport() {
    await axios.post("/api/github/issue", { title, body });
    setSent(true);
    console.log("reporting issue");
  }

  function resetForm() {
    console.log("resetting form");
    setSent(false);
    setTitle("");
    setBody("");
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={resetForm}>
        <Button
          intent="outline"
          className="fixed bottom-5 right-5 z-50 rounded-full p-3"
        >
          <WrenchScrewdriverIcon className="h-6 w-6 shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Andamio Customer Support</DialogTitle>
          <DialogDescription>
            Submit a case directly to our customer success team.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <p>Your report has been submitted.</p>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Title</Label>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label>What&apos;s the problem?</Label>
                <Textarea
                  placeholder="I am having trouble with..."
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="px-3 py-2" onClick={() => handleReport()}>
                Report
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
