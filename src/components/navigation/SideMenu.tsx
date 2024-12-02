import { useRouter } from "next/router";
import DesktopSideMenu from "./DesktopSideMenu";
import MobileSideMenu from "./MobileSideMenu";
import { useEffect, useState } from "react";
import useUserRelationships from "~/hooks/app/useUserRelationships";

export default function SideMenu() {
  const { courses } = useUserRelationships()
  const [currentCourseCode, setCurrentCourseCode] = useState<
    string | undefined
  >(undefined);
  const router = useRouter();

  const { coursecode } = router.query;

  useEffect(() => {
    if (typeof coursecode === "string") {
      setCurrentCourseCode(coursecode);
    }
  }, [coursecode]);

  return (
    <div>
      <DesktopSideMenu
        ownerCourses={courses.asCreator}
        currentCourseCode={currentCourseCode}
      />
      {courses.asCreator && <MobileSideMenu ownerCourses={courses.asCreator} />}
    </div>
  );
}
