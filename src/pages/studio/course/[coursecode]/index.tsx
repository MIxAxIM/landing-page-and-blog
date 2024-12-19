import { type NextPageContext } from "next";
import PageCourse from "~/ui/studio/[coursecode]/PageCourse";

export default function Page({ courseCode }: { courseCode: string }) {
  return <PageCourse courseCode={courseCode} />;
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { coursecode } = ctx.query;
  return { courseCode: coursecode };
};
