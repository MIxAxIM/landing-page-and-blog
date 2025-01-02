import Link from "next/link";
import { Card } from "~/components/ui/card";

export default function IntroductionContainer({
  courseCode,
  moduleCode,
}: {
  courseCode: string;
  moduleCode: string;
}) {

  return (
    <Card className="flex flex-row w-11/12 mx-auto justify-between items-center">
      <div>Introduction</div>
      <Link href={`/studio/course/${courseCode}/${moduleCode}/intro`}>Edit</Link>
    </Card>
  );
}
