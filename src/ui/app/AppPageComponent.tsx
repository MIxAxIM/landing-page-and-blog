import PlaceholderComponent from "../prototype/PlaceholderComponent";


export default function AppPageComponent() {
  return (
    <div className="mx-auto my-24 max-w-7xl space-y-10">
      <PlaceholderComponent name="welcome to andamio" subItems={["search", "network status", "profile"]} />
    </div>
  )
}
