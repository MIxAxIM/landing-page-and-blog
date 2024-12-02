import { api } from "~/utils/api";

export default function useIntroduction(moduleId: string) {
  const {
    data: introduction,
    isLoading: isLoadingIntro,
    isError: isErrorIntro,
    error: errorIntro,
    refetch: refetchIntro,
  } = api.introduction.getIntroduction.useQuery({
    moduleId,
  });

  return {
    introduction,
    isLoadingIntro,
    isErrorIntro,
    errorIntro,
    refetchIntro,
  };
}
