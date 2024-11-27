import { useRouter } from "next/router";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";

export default function ProjectPage() {
  const router = useRouter();
  const { project } = router.query;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Project 1</h1>
        <p className="text-gray-600">
          Explore the in-depth information and curriculum of "Project 1".
        </p>
      </div>

      {/* Image & Description */}
      <div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Project 1"
          className="max-w-sm rounded-lg shadow-md"
        />
        <div>
          <h2 className="mb-2 text-2xl font-semibold">About the Project</h2>
          <p className="text-gray-600">
            Project 1 is a comprehensive guide to learning advanced techniques in
            [topic]. It’s designed to help you master key concepts, improve your
            skills, and achieve your goals.
          </p>
        </div>
      </div>

      {/* Curriculum Section */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">What You Will Learn</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-600">
          <li>Introduction to the fundamentals</li>
          <li>Intermediate concepts and hands-on projects</li>
          <li>Advanced topics to enhance your understanding</li>
          <li>Final project to showcase your skills</li>
        </ul>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <button className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
          Join Now
        </button>
      </div>
    </div>
  );
}
