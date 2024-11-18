import SearchAndamio from "./components/SearchAndamio";
import QuickActionButtons from "./components/QuickActionButtons";



export default function AppPageComponent() {
  return (
    <div className="mx-auto my-24 max-w-7xl">
      <h1 className="text-2xl mt-24 mb-6 text-primary text-center">Welcome to Andamio</h1>

      {/*--- TODO: These messages can be customized based on user status ---*/}
      <h2 className="text-6xl mt-10 mb-24 text-center font-bold">What do you want to work  on today?</h2>
      <h1 className="text-xl mt-24 mb-6 text-primary text-center">type &quot;start learning&quot; in the search bar, or choose a button below</h1>

      {/*--- Search and quick actions buttons should provide: ---*/}
      {/*--- 1. for newcomers, quick access to onboarding and public views ---*/}
      {/*--- 2. for experienced users, quick access to relevant stuff ---*/}
      <SearchAndamio />
      <QuickActionButtons />

    </div>
  )
}

