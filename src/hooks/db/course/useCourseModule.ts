import { api } from "~/utils/api";

export default function useCourseModule(moduleId: string | undefined) {
  const ctx = api.useUtils();

  const { data: courseModule, isLoading } = api.module.getModule.useQuery(
    {
      moduleId: moduleId ? moduleId : "",
    },
    {
      enabled: !!moduleId,
    },
  );

  const updateModuleStatusMutation = api.module.updateModuleStatus.useMutation({
    onSuccess: () => {
      void ctx.module.getModule.invalidate();
      void ctx.module.getCourseModuleOverviews.invalidate();
    }
  });

  return {
    courseModule,
    isLoading,
    updateModuleStatus: updateModuleStatusMutation.mutate,
    isUpdating: updateModuleStatusMutation.isLoading
  };
}
