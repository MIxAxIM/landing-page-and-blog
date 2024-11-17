import { useEffect, useMemo, useState } from "react";
import { useTask } from "~/hooks/contribution/useTask";
import { ComboBox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from "~/components/ui/Combobox";
import { CoursePublic } from "~/types/db";
import { formatPosixTime } from "~/utils/time";
import PublicTaskPageComponent from "../contribution/PublicTaskPageComponent";
import useCourses from "~/hooks/course/useCourses";
import CourseCard from "../courses/components/CourseCard";
import { Button } from "~/components/ui/button";
import AllCourses from "../courses/components/AllCourses";
import AllTasksListComponent from "../contribution/lists/AllTasksListComponent";
import TreasuryListComponent from "../contribution/lists/TreasuryListComponent";
import AccessTokenComponent from "../dashboard/components/AccessTokenComponent";
import OnboardCreator from "../onboarding/OnboardCreator";
import OnboardContributor from "../onboarding/OnboardContributor";
import OnboardTreasuryOwner from "../onboarding/OnboardTreasuryOwner";
import OnboardLearner from "../onboarding/OnboardLearner";
import OnboardOrganizer from "../onboarding/OnboardOrganizer";
import { useTerminology } from "~/contexts/terminology-context";


// NOTE: There are currently two search patterns demonstrated here:
// 1. Given data like `courses`, we can map over it on the client side
// 2. Server-side search can be implemented as in the useTask hook

// TODO: Extract useful components and deliver on user stories given these components

export default function AppPageComponent() {
  const { courses } = useCourses()
  const { translateCapsPlural } = useTerminology()
  const [currentView, setCurrentView] = useState<"COURSES" | "TASKS" | "TREASURIES" | "PARTICIPATE" | undefined>(undefined)
  return (
    <div className="mx-auto my-24 max-w-7xl">
      <h1 className="text-2xl mt-24 mb-6 text-primary text-center">Welcome to Andamio</h1>

      <h2 className="text-6xl mt-10 mb-24 text-center font-bold">What do you want to work  on today?</h2>
      <h1 className="text-2xl mt-24 mb-6 text-primary text-center">type &quot;Start learning&quot;</h1>

      {courses && <TaskComboboxDemo courses={courses} />}
      <div className="flex flex-row w-full gap-5 mx-auto items-center justify-center my-12">
        <Button size="lg" onClick={() => setCurrentView("COURSES")}>View all Courses</Button>
        <Button size="lg" onClick={() => setCurrentView("TASKS")}>View all {translateCapsPlural('task')}</Button>
        <Button size="lg" onClick={() => setCurrentView("TREASURIES")}>View {translateCapsPlural('treasury')}</Button>
        <Button size="lg" onClick={() => setCurrentView("PARTICIPATE")}>Participate</Button>

      </div>
      {currentView === "COURSES" && <AllCourses />}
      {currentView === "TASKS" && <AllTasksListComponent />}
      {currentView === "TREASURIES" && <TreasuryListComponent />}
      {currentView === "PARTICIPATE" && <AccessTokenComponent />}
    </div>
  )
}

type OnboardingTask = { title: string, id: string }
function TaskComboboxDemo({ courses }: { courses: CoursePublic[] }) {
  const { translate, translateCaps } = useTerminology()

  const onboardingTasks: OnboardingTask[] = [
    { title: "Start learning", id: "oLearn" },
    { title: "Start contributing", id: "oContribute" },
    { title: `Start a new ${translate('treasury')}`, id: "oTreasury" },
    { title: "Start teaching", id: "oTeach" },
    { title: `Manage and govern a ${translate('treasury')}`, id: "oOrganize" },
  ]
  const [value, setValue] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const { tasks } = useTask({ searchQuery: searchValue ?? "" });
  const taskByValue = useMemo(() => (value && tasks?.find(task => task.id === value) || null), [value])
  const courseByValue = useMemo(() => (value && courses.find(course => course.id === value) || null), [value])
  const onboardByValue = useMemo(() => (value && onboardingTasks.find(obt => obt.id === value) || null), [value])
  const [filteredCourses, setFilteredCourses] = useState<CoursePublic[]>(courses)
  const [filteredOnboardingTasks, setFilteredOnboardingTasks] = useState<OnboardingTask[]>(onboardingTasks)

  useEffect(() => {
    if (searchValue) {
      const _courses: CoursePublic[] = courses.filter(c => (
        c.title.toLowerCase().includes(searchValue?.toLowerCase() ?? ""
        )))
      setFilteredCourses(_courses)
    }
  }, [searchValue])


  useEffect(() => {
    if (searchValue) {
      const _ot: OnboardingTask[] = onboardingTasks.filter(ot => (
        ot.title.toLowerCase().includes(searchValue?.toLowerCase() ?? ""
        )))
      setFilteredOnboardingTasks(_ot)
    }
  }, [searchValue])

  return (
    <>
      <ComboBox value={value} onValueChange={setValue} filterItems={(inputValue, items) => {

        if (!value) {
          setSearchValue(inputValue)
        }

        if (inputValue.length === 0) {
          setValue(null)
        }

        return (
          items.filter(({ value }) => {
            const _course = filteredCourses?.find(course => course.id === value);
            const _onboardingTasks = onboardingTasks.find(obt => obt.id === value);
            // TODO: Add fuzzy search, and use it to search over more fields
            return (
              !inputValue ||
              _course ||
              tasks ||
              _onboardingTasks
            )


          }))

      }}>
        <ComboboxInput placeholder="Search for a task, lesson, or course" onSelect={() => setSearchValue(null)} />
        <ComboboxContent>
          {filteredOnboardingTasks.length > 0 && (
            <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
              <h3>Onboarding</h3>
            </div>
          )}
          {filteredOnboardingTasks.map(({ title, id }) => (
            <ComboboxItem key={id} value={id} label={title} className="mb-3" >

              <div>
                <h2 className="text-xl font-bold pb-2 mb-2">  {title}
                </h2>

              </div>
            </ComboboxItem>
          ))}
          {tasks.length > 0 && (

            <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
              <h3>{translateCaps('task')}s</h3>
            </div>
          )}
          {tasks.map(({ title, escrow, expirationTime, lovelace, id }) => (
            <ComboboxItem key={id} value={id} label={title} className="mb-3" >

              <div>
                <h2 className="text-xl font-bold pb-2 mb-2 border-b border-primary">  {title}
                </h2>
                <p>{formatPosixTime(expirationTime)}</p>
                <p>Escrows: {escrow?.title}</p>
                <p>Reward: {parseInt(lovelace) / 1000000} </p>

              </div>
            </ComboboxItem>
          ))}
          {filteredCourses.length > 0 && (

            <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
              <h3>Courses</h3>
            </div>
          )}
          {filteredCourses.map(({ title, description, id }) => (
            <ComboboxItem key={id} value={id} label={title} className="mb-3">
              <h2 className="text-xl font-bold pb-2 mb-2 border-b border-primary">{title}</h2>
              <p>{description}</p>


            </ComboboxItem>
          ))}

          <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
            <h3>Lessons</h3>
          </div>
          <ComboboxItem key="example-lesson" value="example-lesson" label="example-lesson">
            <p>Coming Soon</p>


          </ComboboxItem>

          <ComboboxEmpty>No results.</ComboboxEmpty>
        </ComboboxContent>

      </ComboBox>
      <div className="mt-12">
        {taskByValue && <PublicTaskPageComponent task={taskByValue} />}
        {courseByValue && <CourseCard course={courseByValue} savedCourse={false} />}
        {onboardByValue?.id === "oLearn" && <OnboardLearner />}
        {onboardByValue?.id === "oTeach" && <OnboardCreator />}
        {onboardByValue?.id === "oContribute" && <OnboardContributor />}
        {onboardByValue?.id === "oTreasury" && <OnboardTreasuryOwner />}
        {onboardByValue?.id === "oOrganize" && <OnboardOrganizer />}
      </div>
    </>
  )
}
