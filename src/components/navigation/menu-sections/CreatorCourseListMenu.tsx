import Link from "next/link";
import { type CoursePublic } from "~/types/db";
import { useRouter } from "next/router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CreatorCourseListMenu({
  ownerCourses,
}: {
  ownerCourses: CoursePublic[];
}) {
  const router = useRouter();
  return (
    <>
      <li className="">
        <ul role="list" className="">
          {ownerCourses?.map((course) => (
            <li key={course?.courseCode}>
              <Link
                href={`/studio/course/${course?.courseCode}`}
                className={classNames(
                  router.query.coursecode == course?.courseCode
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-primary hover:text-primary-foreground",
                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                )}
              >
                <span
                  className={classNames(
                    router.query.coursecode == course?.courseCode
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-accent-foreground text-accent-foreground group-hover:border-primary group-hover:text-accent-foreground",
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-secondary text-[0.625rem] font-medium",
                  )}
                >
                  {course?.title.substring(0, 1)}
                </span>
                <span className="truncate">{course?.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </>
  );
}
