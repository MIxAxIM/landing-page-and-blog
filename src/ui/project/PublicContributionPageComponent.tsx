import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";

export default function PublicContributionPageComponent() {
  return (
    <div className="mx-auto my-24 max-w-7xl space-y-10 rounded-sm border border-primary p-5">
      <p>Default landing page for contribution</p>
      <PlaceholderComponent name="Browse available contribution tasks" subItems={["filter", "search", "sortable table", "personalized access based on access token state"]} />
      <PlaceholderComponent name="view task details" subItems={["Find out about rewards", "Find out about deadlines", "Know prerequisites", "Know acceptance criteria"]} />
      <PlaceholderComponent name="view calls to action" subItems={["Learn in this course", "Try this task"]} />
    </div>
  )
}
