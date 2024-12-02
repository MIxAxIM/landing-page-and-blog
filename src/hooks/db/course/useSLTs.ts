import { api } from "~/utils/api";

export default function useSLTs(
  courseCode: string,
  moduleCode: string,
  moduleIndex?: number,
) {
  const {
    data: moduleSLTs,
    isLoading: isLoadingModuleSLTs,
    isFetched: isFetchedModuleSLTs,
  } = api.slt.getModuleSLTs.useQuery({
    courseCode,
    moduleCode,
  });

  const { data: slt, isLoading: isLoadingSLT } = api.slt.getSLT.useQuery(
    {
      courseCode: courseCode,
      moduleCode: moduleCode,
      moduleIndex: moduleIndex!,
    },
    { enabled: !!moduleIndex },
  );

  return { moduleSLTs, isLoadingModuleSLTs, isFetchedModuleSLTs, slt, isLoadingSLT };
}
