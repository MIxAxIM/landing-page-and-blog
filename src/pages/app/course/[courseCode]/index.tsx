import Link from "next/link";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import Loading from "~/components/loading";
import useCourse from "~/hooks/course/useCourse";

export default function CoursePage() {
  const router = useRouter();
  const { courseCode } = router.query;
  const { course, isLoadingCourse } = useCourse(courseCode as string);
  return (
    <div className="container mx-auto px-4 py-8">
      {isLoadingCourse && <Loading />}
      {course && (
        <>
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
            <p className="text-gray-600">
              Explore the in-depth information and curriculum of "{course.title}".
            </p>
          </div>

          {/* Image & Description */}
          <div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Course 1"
              className="max-w-sm rounded-lg shadow-md"
            />
            <div>
              <h2 className="mb-2 text-2xl font-semibold">About the Course</h2>
              <p className="text-gray-600">
                {<Markdown>{course.description}</Markdown>}
              </p>
            </div>
          </div>

          {/* Curriculum Section */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">What You Will Learn</h2>
            {/* TODO: Replace by modules/slts */}
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Introduction to the fundamentals</li>
              <li>Intermediate concepts and hands-on projects</li>
              <li>Advanced topics to enhance your understanding</li>
              <li>Final project to showcase your skills</li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="mt-8 flex max-w-sm justify-between text-center">
            <button className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
              Enroll Now
            </button>
            <Link href={`/course/${courseCode}`} passHref>
              <button className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                Take a Peak
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
