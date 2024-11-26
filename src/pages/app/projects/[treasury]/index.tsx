import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/app/ContributionManagerPage";

export default function TreasuryPage() {
  const [treasuryCode, setTreasuryCode] = useState<string | undefined>(
    undefined,
  );
  const router = useRouter();
  const { treasury } = router.query;

  useEffect(() => {
    if (!!treasury && typeof treasury === "string") {
      setTreasuryCode(treasury);
    }
  }, [router, treasury]);

  if (!treasury) return <div>Invalid URL</div>;

  return (
    <DesktopOnlyLayout>
      <ContributionManagerPage selectedTreasuryCode={treasuryCode ?? ""} />
    </DesktopOnlyLayout>
  );
}
