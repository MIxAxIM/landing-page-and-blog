import { type CourseVariant, type ModuleVariant } from "~/types/db";
import { api } from "~/utils/api";

export default function useCourseModulesAndVariants(
  courseCode: string,
  courseVariants: CourseVariant[],
) {
  const moduleVariants: ModuleVariant[] = [];

  const {
    data: modules,
    isLoading,
    refetch,
  } = api.module.getCourseModuleOverviews.useQuery({
    courseCode: courseCode,
  });

  courseVariants.forEach((variant) => {
    try {
      const { data: _moduleVariants } =
        api.moduleVariant.getCourseModuleVariants.useQuery({
          courseVariantId: variant.id,
        });
      if (_moduleVariants) {
        _moduleVariants.forEach((v) => {
          moduleVariants.push(v);
        });
      }
    } catch (error) {
      console.error("Error fetching module variants:", error);
    }
  });

  return { modules, moduleVariants, isLoading, refetch };
}
