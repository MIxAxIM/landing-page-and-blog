import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/app/ContributionManagerPage";
// TODO: If Escrow NFT exists, use that in route
export default function DashboardContributionManagerEscrowPage() {
	const [escrowCode, setEscrowCode] = useState<string | undefined>(undefined);
	const router = useRouter();
	const { escrow } = router.query;

	useEffect(() => {
		if (!!escrow && typeof escrow === "string") {
			setEscrowCode(escrow);
		}
	}, [router, escrow]);

	if (!escrow) return <div>Invalid URL</div>;

	return (
		<DesktopOnlyLayout>
			<ContributionManagerPage selectedEscrowId={escrowCode ?? ""} />
		</DesktopOnlyLayout>
	);
}
