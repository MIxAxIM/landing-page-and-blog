import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { type CourseModuleOverview } from "~/types/db";

export default function useCourseModuleOverviews(courseCode: string) {
  const {
    data: unsortedCourseModuleOverviews,
    isLoading: isLoadingCourseModules,
    refetch: refetchCourseModules,
  } = api.module.getCourseModuleOverviews.useQuery({
    courseCode: courseCode,
  });

  const [courseModuleOverviews, setCourseModuleOverviews] = useState<
    CourseModuleOverview[] | undefined
  >(undefined);

  useEffect(() => {
    if (!!unsortedCourseModuleOverviews) {
      const _courseModuleOverviews = unsortedCourseModuleOverviews.sort(
        (cm1: CourseModuleOverview, cm2: CourseModuleOverview) => {
          if (cm1.moduleCode < cm2.moduleCode) return -1;
          if (cm1.moduleCode > cm2.moduleCode) return 1;
          return 0;
        },
      );
      setCourseModuleOverviews(_courseModuleOverviews);
    }
  }, [unsortedCourseModuleOverviews]);

  return {
    courseModuleOverviews,
    isLoadingCourseModules,
    refetchCourseModules,
  };
}
