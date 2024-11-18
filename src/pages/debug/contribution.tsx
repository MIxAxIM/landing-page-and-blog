import { api } from "~/utils/api";

export default function Components() {
  const { data: policiesData } = api.projectGeneral.getInstancesInfo.useQuery();
  return <div>{JSON.stringify(policiesData?.policies, null, 2)}</div>;
}
