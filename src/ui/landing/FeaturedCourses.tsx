import Loading from "~/components/common/loading";
import useCourses from "~/hooks/db/course/useCourses";
import CourseCard from "../courses/components/CourseCard";

// are there any metrics we can use to decide which courses are featured?
// number of learners
// number of commitments
// number of learners to complete the course
// number of modules
// amount of on-chain engagement / course enrollment
// how often is this course used a pre-req?
// for contributor-facing projects?
// future: for other courses?
// some kind of referral process?
// if a lot of learners are engaged in a course, does that course get featured?
// if a client is paying, do they get any privileges?
const featuredCourseCodes = ["ppbl2024", "mesh"];
// const featuredCourseCodes = ["ec2024", "nc2024"];

export default function FeaturedCourses() {
  const { courses, isLoadingCourses } = useCourses();

  return (
    <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-primary">
          Featured Courses
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Project-Based Learning
        </p>
        <p className="mt-6 text-xl leading-8 text-gray-600">
          Here are some examples of how Andamio is helping organizations to
          expand their network of skilled contributors.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-2xl lg:max-w-4xl">
        {isLoadingCourses && <Loading />}
        {courses && (
          // <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
          //   {courses.map((course, i) => (
          //     <Link href={`/course/${course.courseCode}`} key={i}>
          //       <img
          //         className="aspect-[3/2] w-full rounded-2xl object-cover"
          //         src={
          //           course.imageUrl
          //             ? course.imageUrl
          //             : "/images/sample-covers/1.jpg"
          //         }
          //         alt=""
          //       />
          //       <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-foreground">
          //         {course.title}
          //       </h3>
          //       <p className="text-base leading-7 text-gray-600">
          //         {course.description}
          //       </p>
          //     </Link>
          //   ))}
          // </dl>
          <div className="mx-auto max-w-5xl px-8">
            <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2">
              {courses.map((course) => (
                <>
                  {featuredCourseCodes.includes(course.courseCode) && (
                    <CourseCard course={course} savedCourse={false} />
                  )}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
