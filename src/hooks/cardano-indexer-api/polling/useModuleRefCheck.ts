import { useEffect, useState } from 'react';
import { api } from "~/utils/api";
import { ModuleStatus } from "@prisma/client";
import useCourseModule from '~/hooks/db/course/useCourseModule';
import { ModuleRefUtxo } from '~/server/api/routers/cardano-indexer/course/module-ref-validator';
import { CourseModuleOverview } from '~/types/db';

export function useModuleRefCheck(
	courseModule: CourseModuleOverview,
	courseNftPolicyId: string
) {
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string>();
	const { updateModuleStatus } = useCourseModule(courseModule.id);

	const { data: moduleRefs, refetch } = api.moduleRefValidator.getUtxos.useQuery<ModuleRefUtxo[]>(
		{ courseNftPolicy: courseNftPolicyId },
		{
			enabled: courseModule.status === ModuleStatus.PENDING_TX,
			refetchInterval: courseModule.status === ModuleStatus.PENDING_TX ? 10000 : false
		}
	);


	useEffect(() => {
		if (!moduleRefs || courseModule.status !== ModuleStatus.PENDING_TX) return;

		const matchingRef = moduleRefs.find(ref => {
			return ref.moduleCode === courseModule.moduleCode;
		});

		if (matchingRef?.datum_hash) {
			updateModuleStatus({
				id: courseModule.id,
				status: ModuleStatus.ON_CHAIN,
				moduleHash: matchingRef.datum_hash
			});
			setIsChecking(false);
		}
	}, [moduleRefs, courseModule, courseNftPolicyId, updateModuleStatus]);

	return { moduleRefs, isChecking, error };
}
