import { api } from "~/utils/api";

export default function useModuleByCourse(
  courseCode: string,
  moduleCode: string,
) {
  const { data: modules, isLoading: isLoadingModule } =
    api.module.getCourseModuleOverviews.useQuery({
      courseCode: courseCode,
    });

  const courseModule = modules?.find((m) => m.moduleCode === moduleCode);
  return { courseModule, isLoadingModule };
}
