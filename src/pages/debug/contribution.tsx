import Link from "next/link";
import { api } from "~/utils/api";

export default function Components() {
  const { data: policiesData } = api.instanceValidator.getInstancesInfo.useQuery();
  return (
    <div>
      List of Treasuries{" "}
      <div>{policiesData?.policies.map((policy) => {
        return <Link href={`contribution/${policy}`} key={policy}>{policy}</Link>;
      })}</div>
    </div>
  );
}
