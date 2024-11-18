import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/app/ContributionManagerPage";

export default function DashboardContributionManagerEscrowPage() {
	const [escrowCode, setEscrowCode] = useState<string | undefined>(undefined);
	const router = useRouter();
	const { project } = router.query;

	useEffect(() => {
		if (!!project && typeof project === "string") {
			setEscrowCode(project);
		}
	}, [router, project]);

	if (!project) return <div>Invalid URL</div>;

	return (
		<DesktopOnlyLayout>
			<ContributionManagerPage selectedEscrowCode={escrowCode ?? ""} />
		</DesktopOnlyLayout>
	);
}
