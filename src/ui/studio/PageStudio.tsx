import StudioHeader from "./components/StudioHeader";
import ListCourses from "./components/ListCourses";
import StudioLayout from "./components/layout/StudioLayout";
import CourseLimitCTA from "./components/CourseLimitCTA";

export default function PageStudio() {
  return (
    <StudioLayout>
      <div className="flex flex-col gap-4 sm:mx-auto sm:w-[630px] md:w-[750px] lg:w-[850px] xl:w-[950px]">
        <StudioHeader />
        <ListCourses />
        <CourseLimitCTA />
      </div>
    </StudioLayout>
  );
}  
