import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";

export default function ContributeTreasuryPage() {
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
      <PlaceholderComponent name="contributor can view a project treasury" />
      <pre>{treasuryCode}</pre>
    </DesktopOnlyLayout>
  );
}
