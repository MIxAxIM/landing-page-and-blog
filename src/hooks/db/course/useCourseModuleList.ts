import { api } from "~/utils/api";

export type CourseModuleInfo = { title: string; moduleCode: string };

interface UseCourseModuleListReturn {
  courseModuleLists: Record<string, CourseModuleInfo[]>;
  isLoadingCourseModuleLists: boolean;
}

export default function useCourseModuleList(
  courseCodes: string[],
): UseCourseModuleListReturn {
  const enabledCourseCodes = courseCodes.filter(Boolean);

  const { data, isLoading } = api.module.getCourseModuleList.useQuery(
    { courseCodes: enabledCourseCodes },
    { enabled: enabledCourseCodes.length > 0 },
  );

  const sortedData = data
    ? Object.fromEntries(
      Object.entries(data).map(([courseCode, modules]) => [
        courseCode,
        [...modules].sort((a, b) => a.moduleCode.localeCompare(b.moduleCode)),
      ]),
    )
    : {};

  return {
    courseModuleLists: sortedData,
    isLoadingCourseModuleLists: isLoading,
  };
}
