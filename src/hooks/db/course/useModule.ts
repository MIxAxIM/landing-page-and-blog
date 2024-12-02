import { api } from "~/utils/api";

export default function useModule(moduleId: string | undefined) {
  const { data: module, isLoading } = api.module.getModule.useQuery(
    {
      moduleId: moduleId ? moduleId : "",
    },
    {
      enabled: !!moduleId,
    },
  );

  return { module, isLoading };
}
