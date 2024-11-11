import { useMemo, useState } from "react";
import PlaceholderComponent from "../prototype/PlaceholderComponent";
import { useTask } from "~/hooks/contribution/useTask";
import { ComboBox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from "~/components/ui/Combobox";
import { CoursePublic, Task } from "~/types/db";
import { formatPosixTime } from "~/utils/time";
import PublicTaskPageComponent from "../contribution/PublicTaskPageComponent";
import useCourses from "~/hooks/course/useCourses";
import CourseCard from "../courses/components/CourseCard";

//       <PlaceholderComponent name="additional CTAs" subItems={["view all tasks", "network status", "profile"]} />


export default function AppPageComponent() {
  const { tasks } = useTask({});
  const { courses } = useCourses()
  return (
    <div className="mx-auto my-24 max-w-7xl space-y-10">
      <h1 className="text-4xl my-10 text-center">Welcome to Andamio</h1>
      {courses && tasks && <TaskComboboxDemo tasks={tasks} courses={courses} />}

    </div>
  )
}


function TaskComboboxDemo({ tasks, courses }: { tasks: Task[], courses: CoursePublic[] }) {

  const [value, setValue] = useState<string | null>(null);
  const taskByValue = useMemo(() => (value && tasks?.find(task => task.id === value) || null), [value])
  const courseByValue = useMemo(() => (value && courses.find(course => course.id === value) || null), [value])




  return (
    <>

      <ComboBox value={value} onValueChange={setValue} filterItems={(inputValue, items) =>

        items.filter(({ value }) => {
          const _task = tasks.find(task => task.id === value);
          const _course = courses.find(course => course.id === value);
          // TODO: Add fuzzy search, and use it to search over more fields
          return (
            !inputValue ||
            (_task && (_task.title.toLowerCase().includes(inputValue.toLowerCase()))) ||
            (_course && (_course.title.toLowerCase().includes(inputValue.toLowerCase())))
          )
        })
      }>
        <ComboboxInput placeholder="Search for a task, lesson, or course" />
        <ComboboxContent>
          <div className="flex w-full bg-primary text-primary-foreground p-2">
            <h3>Tasks</h3>
          </div>
          {tasks.map(({ title, escrow, expirationTime, lovelace, id }) => (
            <ComboboxItem key={id} value={id} label={title} >

              <div>
                <h2 className="text-xl font-bold pb-2 mb-2 border-b border-primary">  {title}
                </h2>
                <p>{formatPosixTime(expirationTime)}</p>
                <p>Escrow: {escrow?.title}</p>
                <p>Reward: {parseInt(lovelace) / 1000000} </p>

              </div>
            </ComboboxItem>
          ))}

          <div className="flex w-full bg-primary text-primary-foreground p-2">
            <h3>Courses</h3>
          </div>
          {courses.map(({ title, description, id }) => (
            <ComboboxItem key={id} value={id} label={title}>
              <h2 className="text-xl font-bold pb-2 mb-2 border-b border-primary">{title}</h2>
              <p>{description}</p>


            </ComboboxItem>
          ))}


          <ComboboxEmpty>No results.</ComboboxEmpty>
        </ComboboxContent>

      </ComboBox>
      <div>
        {taskByValue && <PublicTaskPageComponent task={taskByValue} />}
        {courseByValue && <CourseCard course={courseByValue} savedCourse={false} />}
      </div>
    </>
  )
}
