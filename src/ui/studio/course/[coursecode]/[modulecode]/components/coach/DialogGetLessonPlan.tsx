import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import axios from "axios";
import { type ModuleSLT } from "~/types/db";
import { useCourseStore } from "~/lib/zustand/course";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export function DialogGetLessonPlan({
  open,
  setOpen,
  slt,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  slt: ModuleSLT;
}) {
  const { data: sessionData } = useSession();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<undefined | string>(undefined);
  const setUpdateLessonEdit = useCourseStore(
    (state) => state.setUpdateLessonEdit,
  );

  async function fetchLessonPlan() {
    setLoading(true);

    if (sessionData) {
      const resLessonPlan: { data: { data: { final_output: string } } } =
        await axios.post(`/api/ai/get-lesson-plan`, {
          slt: slt.sltText,
          userId: sessionData.user.id,
        });
      // console.log("resLessonPlan", resLessonPlan.data);
      setResult(resLessonPlan.data.data.final_output);
    }
    setLoading(false);
  }

  async function addToLesson() {
    if (result) {
      const toUpdateLessonEditor = [
        {
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Here are some lesson sub-headings to help you get started:",
            },
          ],
          type: "heading",
        },
      ];

      for (const _newData of result.split("\n")) {
        const _newRow = {
          attrs: {
            level: 3,
          },
          content: [{ type: "text", text: _newData }],
          type: "heading",
        };
        toUpdateLessonEditor.push(_newRow);
      }

      setUpdateLessonEdit(toUpdateLessonEditor);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Lesson Plan</DialogTitle>
          <DialogDescription>{slt.sltText}</DialogDescription>
        </DialogHeader>

        {result &&
          result.split("\n").map((line, index) => <p key={index}>{line}</p>)}

        <DialogFooter>
          {result ? (
            <Button onClick={() => addToLesson()} disabled={loading}>
              Add to lesson
            </Button>
          ) : (
            <Button onClick={() => fetchLessonPlan()} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get lesson plan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
