import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useTerminology } from "~/contexts/terminology-context";
import MintAccessToken from "~/ui/app/components/MintAccessToken";
import DialogOrganization from "~/ui/app/components/dialogs/DialogOrganization";
import AllTasksListComponent from "~/ui/contribution/lists/AllTasksListComponent";
import TreasuryListComponent from "~/ui/contribution/lists/TreasuryListComponent";
import AllCourses from "~/ui/courses/components/AllCourses";

export default function QuickActionButtons() {
  const [currentView, setCurrentView] = useState<"COURSES" | "TASKS" | "TREASURIES" | "PARTICIPATE" | undefined>(undefined)
  const { translateCapsPlural } = useTerminology()
  return (
    <>

      {/*--- Action Buttons ---*/}
      <div className="flex flex-row w-full gap-5 mx-auto items-center justify-center my-12">
        <Button size="lg" onClick={() => setCurrentView("COURSES")}>View all Courses</Button>
        <Button size="lg" onClick={() => setCurrentView("TASKS")}>View all {translateCapsPlural('task')}</Button>
        <Button size="lg" onClick={() => setCurrentView("TREASURIES")}>View {translateCapsPlural('treasury')}</Button>
        <Button size="lg" onClick={() => setCurrentView("PARTICIPATE")}>Participate</Button>

      </div>
      {currentView === "COURSES" && <AllCourses />}
      {currentView === "TASKS" && <AllTasksListComponent />}
      {currentView === "TREASURIES" && <TreasuryListComponent />}
      {currentView === "PARTICIPATE" && <MintAccessToken />}
      <DialogOrganization />
    </>
  )
}
