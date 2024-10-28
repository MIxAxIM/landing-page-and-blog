import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/profile/ContributionManagerPage";

export default function DashboardContributionManagerTreasuryPage() {
  const [treasuryCode, setTreasuryCode] = useState<string | undefined>(
    undefined,
  );
  const router = useRouter();
  const { treasurycode } = router.query;

  useEffect(() => {
    if (!!treasurycode && typeof treasurycode === "string") {
      setTreasuryCode(treasurycode);
    }
  }, [router, treasurycode]);

  if (!treasurycode) return <div>Invalid URL</div>;

  return (
    <DesktopOnlyLayout>
      <ContributionManagerPage selectedTreasuryCode={treasuryCode ?? ""} />
    </DesktopOnlyLayout>
  );
}
