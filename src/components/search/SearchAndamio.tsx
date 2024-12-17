import { useMemo, useState } from "react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { ComboBox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from "~/components/ui/Combobox";
import { formatPosixTime } from "~/utils/time";
import { useTerminology } from "~/contexts/terminology-context";
import PublicTaskPageComponent from "~/ui/contribution/PublicTaskPageComponent";
import CourseCard from "~/ui/courses/components/CourseCard";
import OnboardLearner from "~/ui/onboarding/OnboardLearner";
import OnboardCreator from "~/ui/onboarding/OnboardCreator";
import OnboardContributor from "~/ui/onboarding/OnboardContributor";
import OnboardTreasuryOwner from "~/ui/onboarding/OnboardTreasuryOwner";
import OnboardOrganizer from "~/ui/onboarding/OnboardOrganizer";
import useCourses from "~/hooks/db/course/useCourses";
import { useOnboardingTasks } from "~/hooks/app/useOnboardingTasks";

// NOTE: There are currently two search patterns demonstrated here:
// 1. Given data like `courses`, we can map over it on the client side
// 2. Server-side search can be implemented as in the useTask hook

// TODO: Post MVP, continually refine search according to needs in futture user stories.

export default function SearchAndamio() {
  const { translate, translateCapsPlural } = useTerminology()
  const { courses } = useCourses()
  const { onboardingTasks } = useOnboardingTasks()
  const [value, setValue] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const { tasks } = useTask({ searchQuery: searchValue ?? "" });

  const taskByValue = useMemo(() => (value && tasks?.find(task => task.id === value) || null), [value, tasks])
  const courseByValue = useMemo(() => (value && courses?.find(course => course.id === value) || null), [value, courses])
  const onboardByValue = useMemo(() => (value && onboardingTasks.find(obt => obt.id === value) || null), [value, onboardingTasks])
  const filteredCourses = useMemo(() => {
    if (!searchValue || !courses) return courses
    return courses.filter(c =>
      c.title.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue, courses])

  const filteredOnboardingTasks = useMemo(() => {
    if (!searchValue) return onboardingTasks
    return onboardingTasks.filter(ot =>
      ot.title.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue, onboardingTasks])


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
        <ComboboxInput placeholder={`Search for a ${translate('treasury')} or course`} onSelect={() => setSearchValue(null)} />
        <ComboboxContent>
          {filteredOnboardingTasks.length > 0 && (
            <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
              <h3>Interactive Tutorials</h3>
            </div>
          )}
          {filteredOnboardingTasks.map(({ title, id }) => (
            <ComboboxItem key={id} value={id} label={title} className="mb-3" >

              <div>
                <div className="text-xl py-2 hover:font-semibold">  {title}
                </div>

              </div>
            </ComboboxItem>
          ))}
          {tasks.length > 0 && (

            <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
              <h3>{translateCapsPlural('task')}</h3>
            </div>
          )}
          {tasks.map(({ title, escrow, expirationTime, lovelace, id }) => (
            <ComboboxItem key={id} value={id} label={title} className="mb-3" >

              <div>
                <div className="text-xl py-2 hover:font-semibold">  {title}
                </div>
                <p>{formatPosixTime(expirationTime)}</p>
                <p>Escrows: {escrow?.title}</p>
                <p>Reward: {parseInt(lovelace) / 1000000} </p>

              </div>
            </ComboboxItem>
          ))}
          {!!filteredCourses && (
            <div className="flex w-full px-3 py-5 mb-5 border-b border-primary text-2xl font-bold text-primary bg-muted">
              <h3>Courses</h3>
            </div>

          )}
          {filteredCourses?.map(({ title, description, id }) => (
            <ComboboxItem key={id} value={id} label={title} className="mb-3">
              <div className="text-xl py-2 hover:font-semibold">{title}</div>
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

// TODO:
// {taskByValue && <PublicTaskPageComponent task={taskByValue} />}
