import Link from "next/link";
import Markdown from "react-markdown";
import { Card } from "~/components/ui/card";
import type { CoursePublic } from "~/types/db";

export default function CourseButtonCard({
  course,
  link,
}: {
  course: CoursePublic;
  link: string;
}) {
  return (
    <Link href={link}>
      <Card className="">
        <p className="text-lg font-medium">{course?.title}</p>
        <p className="mt-1 text-sm">
          <Markdown>{course?.description}</Markdown>
        </p>
      </Card>
    </Link>
  );
}
