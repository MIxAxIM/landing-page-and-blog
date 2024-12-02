import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";

export default function ContributeEscrowPage() {
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
      <PlaceholderComponent name="contributor can view escrow details here" />
      <pre>{escrowCode}</pre>
    </DesktopOnlyLayout>
  );
}
