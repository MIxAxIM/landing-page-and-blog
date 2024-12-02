import { HomeIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import classNames from "~/utils/classnames";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useCourse from "~/hooks/db/course/useCourse";
import useValidateCreator from "~/hooks/db/course/useValidateCreator";
import { PenTool } from "lucide-react";
import CourseOutline from "./CourseOutline";

export const navigationItems = [
  { name: "Home", href: "/dashboard", icon: HomeIcon, current: false },
  { name: "Studio", href: "/studio", icon: PenTool, current: false },
];

export default function Navigation() {
  const router = useRouter();
  const { coursecode } = router.query;
  const { data: sessionData } = useSession();

  const { isCreator } = useValidateCreator(sessionData);

  return (
    <>
      {typeof coursecode === "string" &&
        router.pathname.includes("/course/[coursecode]") ? (
        <>
          <NavigationItems isCreator={isCreator} />
          <CoursePage courseCode={coursecode} />
        </>
      ) : (
        <p>Select a course to view details</p>
      )}
    </>
  );
}

function NavigationItems({ isCreator }: { isCreator: boolean }) {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigationItems.map((item) => {
        if (item.name === "Studio" && !isCreator) {
          return null;
        }
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={classNames(
                item.current
                  ? "text-accent-foreground-foreground bg-accent"
                  : "hover:text-accent-foreground-foreground text-foreground hover:bg-accent",
                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
              )}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-accent-foreground-foreground"
                    : "text-accent-foreground-foreground group-hover:text-accent-foreground-foreground",
                  "h-6 w-6 shrink-0",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function CoursePage({ courseCode }: { courseCode: string }) {
  const { data: sessionData } = useSession();
  const { course } = useCourse(courseCode);
  const { isCreator } = useValidateCreator(sessionData, courseCode);

  return (
    <>
      <li>
        <ul role="list" className="-mx-2 space-y-1">
          <li>
            <Link
              href={`/course/${course?.courseCode}`}
              className={classNames(
                "hover:text-accent-foreground-foreground text-foreground hover:bg-accent",
                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
              )}
            >
              <AcademicCapIcon
                className={classNames(
                  "text-accent-foreground-foreground group-hover:text-accent-foreground-foreground",
                  "h-6 w-6 shrink-0",
                )}
                aria-hidden="true"
              />
              {course?.title}
            </Link>
          </li>
        </ul>
        <CourseOutline currentCourseCode={courseCode} isCreator={isCreator} />
      </li>
    </>
  );
}
