import { api } from "~/utils/api";

export default function useNetworkCourseConfig() {
  const { data: AllCoursesOnchain, isLoading: isLoadingAllCoursesOnchain } =
    api.courseOnChainInstance.getAllCoursesOnchain.useQuery();

  return { AllCoursesOnchain, isLoadingAllCoursesOnchain };
}
