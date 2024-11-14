import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/app/ContributionManagerPage";

export default function DashboardContributionManagerTreasuryPage() {
  const [treasuryCode, setTreasuryCode] = useState<string | undefined>(
    undefined,
  );
  const router = useRouter();
  const { treasurynftcs } = router.query;

  useEffect(() => {
    if (!!treasurynftcs && typeof treasurynftcs === "string") {
      setTreasuryCode(treasurynftcs);
    }
  }, [router, treasurynftcs]);

  if (!treasurynftcs) return <div>Invalid URL</div>;

  return (
    <DesktopOnlyLayout>
      <ContributionManagerPage selectedTreasuryCode={treasuryCode ?? ""} />
    </DesktopOnlyLayout>
  );
}
