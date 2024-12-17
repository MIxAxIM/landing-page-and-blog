import useUserRelationships from "~/hooks/app/useUserRelationships";
import { useTerminology } from "~/contexts/terminology-context";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import DialogInitializeProject from "~/ui/onboarding/components/dialogs/DialogInitializeProject";
import { ProjectImageSelect } from "~/ui/app/components/ProjectImageSelect";

export default function ContributionManagerComponent() {
  const { translateCaps } = useTerminology()
  // db hooks
  const { treasuries } = useUserRelationships()
  const [singletonProject, setSingletonProject] = useState<boolean>(true)
  const [currentProjectId, setCurrentProjectId] = useState<{ treasuryNftPolicyId: string, treasuryId: string, escrowId: string } | undefined>(undefined)
  // cardano hooks

  useEffect(() => {
    if (treasuries.asOwner.length > 1) {
      setSingletonProject(false)
    }
    if (!!treasuries.asOwner[0] && treasuries.asOwner.length === 1) {
      setCurrentProjectId({ treasuryNftPolicyId: treasuries.asOwner[0].treasuryNftPolicyId ?? "", treasuryId: treasuries.asOwner[0].id, escrowId: treasuries.asOwner[0].escrowIds[0] ?? "" })
    }
  }, [treasuries])

  return (
    <div>
      <div className="mx-auto my-2 w-full">
        {!currentProjectId && (
          <>
            <div className="col-span-3 flex flex-row items-center justify-between">
              <h1>Your Projects</h1>
              <div className="flex flex-row items-center space-x-5">
                <DialogInitializeProject />
              </div>
            </div>
          </>
        )}
        {!singletonProject && (
          <>
            <div className="">
              {!!currentProjectId && <Button onClick={() => setCurrentProjectId(undefined)}>Back</Button>}
            </div>
            <div className="">
              {/** <h3>As {translateCaps('treasury')} Owner</h3> **/}
              <div className="grid grid-cols-2 gap-10 my-6">
                {treasuries.asOwner.map((treasury) => (
                  <div key={treasury.id}>
                    <ProjectImageSelect treasury={treasury} escrowId={treasury.escrowIds[0]} />
                  </div>

                ))}
              </div>
            </div>
            {/** Future feature: Viewing as Contribution Manager added to a project
            <div className="my-6">
              <h3>As {translateCaps('contributionManager')}</h3>
              <div className="grid grid-cols-2 gap-3 my-6">
                {treasuries.asManager.map((treasury) => (
                  <div key={treasury.id}>
                    <ProjectImageSelect treasury={treasury} />
                  </div>
                ))}
              </div>
            </div>
            **/}
            <div className="w-full border-t border-primary my-12" />
          </>
        )}
      </div>
    </div>
  );
}

// TODO: User Stories:
//
//<div className="mx-auto mt-12 grid w-full grid-cols-3 gap-5">
//  <PlaceholderComponent name="Status Updates: Yoram and Contribution managers can update the status of tasks (e.g., Draft, Approved --> other changes are in respone to on-chain events)." />
//  <PlaceholderComponent name="Progress Tracking Dashboard: A dashboard is available where Yoram can view all tasks with their current statuses, committed contributors, and deadlines." />
//  <PlaceholderComponent name="Notifications: Yoram receives notifications for key events such as task completions, upcoming due dates." />
//  <PlaceholderComponent name="Collaboration Tools: Yoram can add comments to tasks to facilitate communication with team members. --> Task route" />
//  <PlaceholderComponent name="Reporting: Yoram can generate reports summarizing task progress, completed tasks, and pending tasks." />
//  <PlaceholderComponent name="Access Control -- Org Features: Yoram can control who can view or edit tasks within his workspace." />
//  <PlaceholderComponent name="Usability: The task management interface is intuitive and requires minimal training for Yoram to use effectively." />
//  <PlaceholderComponent name="Data Export: Yoram can export task data in common formats (e.g., CSV, PDF) for external reporting needs." />
//</div>
