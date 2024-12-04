import DialogTreasury from "~/ui/contribution/dialogs/DialogTreasury";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import useUserRelationships from "~/hooks/app/useUserRelationships";
import { Card } from "~/components/ui/card";
import { useTerminology } from "~/contexts/terminology-context";
import MyProjectsListComponent from "./MyProjectsListComponent";
import DialogTaskToProject from "~/ui/contribution/dialogs/DialogTaskToProject";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import ManageEscrowComponent from "./ManageEscrowComponent";

export default function ContributionManagerComponent() {
  const { translateCaps } = useTerminology()
  // db hooks
  const { treasuries } = useUserRelationships()
  const [singletonProject, setSingletonProject] = useState<boolean>(true)
  const [currentProjectId, setCurrentProjectId] = useState<{ treasuryId: string, escrowId: string } | undefined>(undefined)
  // cardano hooks


  useEffect(() => {
    if (treasuries.asOwner.length > 1) {
      setSingletonProject(false)
    }
    if (!!treasuries.asOwner[0] && treasuries.asOwner.length === 1) {
      setCurrentProjectId({ treasuryId: treasuries.asOwner[0].id, escrowId: treasuries.asOwner[0].escrowIds[0] ?? "" })
    }
  }, [treasuries])

  return (
    <div>
      <div className="mx-auto my-6 w-full">
        {!singletonProject && (
          <>
            <div className="min-h-[60px]">
              {!!currentProjectId && <Button onClick={() => setCurrentProjectId(undefined)}>Back</Button>}
            </div>
            <h3>As {translateCaps('treasury')} Owner</h3>
            <div className="grid grid-cols-5 gap-3 my-5">
              {treasuries.asOwner.map((treasury) => (
                <Card key={treasury.id} className={`flex flex-row justify-between items-center ${currentProjectId?.treasuryId === treasury.id && "bg-secondary"}`}>
                  <p>{treasury.title}</p>
                  <Button onClick={() => setCurrentProjectId({ treasuryId: treasury.id, escrowId: treasury.escrowIds[0] ?? "" })}>View</Button>
                </Card>
              ))}
            </div>
            <h3>As {translateCaps('contributionManager')}</h3>
            <div className="grid grid-cols-5 gap-3 my-5">
              {treasuries.asManager.map((treasury) => (
                <Card key={treasury.id} className={`flex flex-row justify-between items-center ${currentProjectId?.treasuryId === treasury.id && "bg-secondary"}`}>
                  <p>{treasury.title}</p>
                  <Button onClick={() => setCurrentProjectId({ treasuryId: treasury.id, escrowId: treasury.escrowIds[0] ?? "" })}>View</Button>
                </Card>
              ))}
            </div>
            <div className="w-full border-t border-primary my-12" />
          </>
        )}


        {!currentProjectId && (
          <>
            <div className="col-span-3 flex flex-row items-center justify-between">
              <h1>{translateCaps('treasuryOwner')} Page</h1>
              <div className="flex flex-row items-center space-x-5">
                <DialogTaskToProject />
                <DialogTreasury />
              </div>
            </div>
            <h2>
              All Projects:
            </h2>
            <MyProjectsListComponent />
          </>
        )}

        {!!currentProjectId && (
          <>
            <ManageEscrowComponent escrowId={currentProjectId.escrowId} treasuryNftPolicyId={currentProjectId.treasuryId} />
          </>
        )}
      </div>
      <div className="mx-auto mt-12 grid w-full grid-cols-3 gap-5">
        <PlaceholderComponent name="When Yoram has one Project, the app/project route shows only that project. When Yoram has Organization access OR memebership in other Projects, this page shows a list of Projects." />
        <PlaceholderComponent name="Task Creation: Yoram can create new tasks within his workspace with essential details such as title, description, skill requirements, due date" />

        <PlaceholderComponent name="Task Editing: Yoram can edit task details anytime (before the task is approved to be published on-chain), including changing due dates and reward amounts." />

        <PlaceholderComponent name="Task Deletion: Yoram can delete draft tasks (before publishing on-chain)." />

        <PlaceholderComponent name="Status Updates: Yoram and Contribution managers can update the status of tasks (e.g., Draft, Approved --> other changes are in respone to on-chain events)." />

        <PlaceholderComponent name="Progress Tracking Dashboard: A dashboard is available where Yoram can view all tasks with their current statuses, committed contributors, and deadlines." />

        <PlaceholderComponent name="Filtering and Sorting: Yoram can filter and sort tasks based on criteria like status, due date, priority, or Contributor to track progress easily." />

        <PlaceholderComponent name="Notifications: Yoram receives notifications for key events such as task completions, upcoming due dates." />

        <PlaceholderComponent name="Collaboration Tools: Yoram can add comments to tasks to facilitate communication with team members. --> Task route" />

        <PlaceholderComponent name="Reporting: Yoram can generate reports summarizing task progress, completed tasks, and pending tasks." />

        <PlaceholderComponent name="Access Control -- Org Features: Yoram can control who can view or edit tasks within his workspace." />

        <PlaceholderComponent name="Usability: The task management interface is intuitive and requires minimal training for Yoram to use effectively." />

        <PlaceholderComponent name="Data Export: Yoram can export task data in common formats (e.g., CSV, PDF) for external reporting needs." />

      </div>
    </div>
  );
}
