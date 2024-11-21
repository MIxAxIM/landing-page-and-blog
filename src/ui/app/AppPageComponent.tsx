import SearchAndamio from "./components/SearchAndamio";
import QuickActionButtons from "./components/QuickActionButtons";



export default function AppPageComponent() {
  return (
    <div className="mx-auto my-24 max-w-7xl text-center">
      <div className="text-2xl font-bold">Welcome to Andamio</div>

      {/*--- TODO: These messages can be customized based on user status ---*/}
      <div className="text-6xl my-24">What do you want to work  on today?</div>
      <div className="text-xl font-light mb-8">type &quot;start learning&quot; in the search bar, or choose a button below</div>

      {/*--- Search and quick actions buttons should provide: ---*/}
      {/*--- 1. for newcomers, quick access to onboarding and public views ---*/}
      {/*--- 2. for experienced users, quick access to relevant stuff ---*/}
      <SearchAndamio />
      <QuickActionButtons />

    </div>
  )
}

