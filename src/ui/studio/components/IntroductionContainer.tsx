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
    <Card intent="module" size="wide">
      <div>Introduction</div>
      <Link href={`/studio/course/${courseCode}/${moduleCode}/intro`}>Edit</Link>
    </Card>
  );
}
