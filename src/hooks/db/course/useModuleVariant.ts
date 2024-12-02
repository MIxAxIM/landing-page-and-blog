import { api } from "~/utils/api";

export default function useModuleVariant(
  courseVariantId: string,
  moduleId: string,
) {

  const {
    data: moduleVariant,
    isLoading: isLoadingModuleVariant,
    refetch: refetchModuleVariant,
  } = api.moduleVariant.getModuleVariant.useQuery({
    courseVariantId: courseVariantId,
    moduleId: moduleId,
  });

  return { moduleVariant, isLoadingModuleVariant, refetchModuleVariant };
}
