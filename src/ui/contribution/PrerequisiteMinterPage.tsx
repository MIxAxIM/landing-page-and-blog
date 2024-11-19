import { useTerminology } from "~/contexts/terminology-context";
import AppLayout from "../app/layout/AppLayout";
import PlaceholderComponent from "../prototype/PlaceholderComponent";
import PrerequisiteForm from "./form/PrerequisiteFormComponent";

export default function PrerequisiteMinterPage() {
  const { translate, translateCaps } = useTerminology()
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2 className="my-10 text-4xl">Mint a New Andamio {translateCaps('prerequisite')}</h2>
        <div className="flex w-full flex-col">
          <PrerequisiteForm />
        </div>
        <PlaceholderComponent name="Search existing prereqs">
          <div>precisely define the role of search according to user stories</div>
        </PlaceholderComponent>
        <PlaceholderComponent name="Make connections">
          <div>
            Explore ways to discover courses vs. discovering contribution
            opportunities
          </div>
        </PlaceholderComponent>
      </div>
    </AppLayout>
  );
}
