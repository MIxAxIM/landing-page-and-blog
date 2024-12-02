import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/app/ContributionManagerPage";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
// TODO: If Escrow NFT exists, use that in route
export default function DashboardContributionManagerEscrowPage() {
	const [treasuryCode, setTreasuryCode] = useState<string | undefined>(undefined);
	const [escrowCode, setEscrowCode] = useState<string | undefined>(undefined);
	const router = useRouter();
	const { treasury, escrow } = router.query;

	useEffect(() => {
		if (!!treasury && typeof treasury === "string") {
			setTreasuryCode(treasury);
		}
		if (!!escrow && typeof escrow === "string") {
			setEscrowCode(escrow);
		}
	}, [router, escrow, treasury]);

	if (!escrow || !treasury) return <div>Invalid URL</div>;

	if (!treasuryCode) return <LoadingCircle />
	return (
		<DesktopOnlyLayout>
			<ContributionManagerPage selectedEscrowId={escrowCode ?? ""} selectedTreasuryCode={treasuryCode} />
		</DesktopOnlyLayout>
	);
}
