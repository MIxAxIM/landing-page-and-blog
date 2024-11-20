import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import { useOrganization } from "~/hooks/organization/useOrganization";
import DialogOrganization from "~/ui/app/components/dialogs/DialogOrganization";
import AppLayout from "~/ui/app/layout/AppLayout";
import CoursesList from "~/ui/app/organization/CoursesList";
import MembersList from "~/ui/app/organization/MembersList";
import TreasuriesList from "~/ui/app/organization/TreasuriesList";

export default function OrganizationPage() {
	const [organizationId, setOrganizationId] = useState<string | undefined>(
		undefined,
	);
	const router = useRouter();
	const { organization } = router.query;

	useEffect(() => {
		if (!!organization && typeof organization === "string") {
			setOrganizationId(organization);
		}
	}, [router, organization]);

	if (!organizationId) return <div>Invalid URL</div>;

	return (
		<DesktopOnlyLayout>
			<AppLayout>
				<OrganizationDashboard organizationId={organizationId} />
			</AppLayout>
		</DesktopOnlyLayout>
	);
}


function OrganizationDashboard({ organizationId }: { organizationId: string }) {
	const { organization, isLoading } = useOrganization(organizationId);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="my-24 max-w-7xl mx-auto">
			<h1>{organization?.name}</h1>
			<MembersList organizationId={organizationId} />
			<CoursesList organizationId={organizationId} />
			<TreasuriesList organizationId={organizationId} />
			<DialogOrganization />
		</div>
	);
};


