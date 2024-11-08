import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/profile/ContributionManagerPage";

export default function DashboardContributionManagerEscrowPage() {
  const [escrowCode, setEscrowCode] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { escrownftcs } = router.query;

  useEffect(() => {
    if (!!escrownftcs && typeof escrownftcs === "string") {
      setEscrowCode(escrownftcs);
    }
  }, [router, escrownftcs]);

  if (!escrownftcs) return <div>Invalid URL</div>;

  return (
    <DesktopOnlyLayout>
      <ContributionManagerPage selectedEscrowCode={escrowCode ?? ""} />
    </DesktopOnlyLayout>
  );
}
