import ProfileLayout from "../profile/layout/ProfileLayout";
import PlaceholderComponent from "../prototype/PlaceholderComponent";
import PrerequisiteForm from "./form/PrerequisiteFormComponent";

export default function PrerequisiteMinterPage() {
  return (
    <ProfileLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2 className="my-10 text-4xl">Mint a New Andamio Prerequisite</h2>
        <div className="flex w-full flex-col">
          <PrerequisiteForm />
        </div>
        <PlaceholderComponent name="Search existing prereqs">
          <div>Demo a Combobox Here</div>
        </PlaceholderComponent>
        <PlaceholderComponent name="Make connections">
          <div>
            Explore ways to discover courses vs. discovering contribution
            opportunities
          </div>
        </PlaceholderComponent>
      </div>
    </ProfileLayout>
  );
}
