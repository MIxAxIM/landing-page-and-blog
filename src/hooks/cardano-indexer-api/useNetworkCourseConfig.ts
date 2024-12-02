import { type Network } from "@prisma/client";
import { api } from "~/utils/api";

export default function useNetworkCourseConfig(
  courseCode: string,
  network: Network,
) {
  const { data: courseOnchain, isLoading: isLoadingCourseOnchain } =
    api.courseOnChainInstance.getCourseOnchainInstances.useQuery({
      courseCode: courseCode,
      network: network,
    });

  return { courseOnchain, isLoadingCourseOnchain };
}
