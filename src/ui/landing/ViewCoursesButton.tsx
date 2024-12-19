import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ViewCoursesButton() {
  return (
    <Link href="/course">
      <Button>Browse All Courses</Button>
    </Link>
  );
}
