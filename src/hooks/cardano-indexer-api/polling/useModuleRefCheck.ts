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
  const { updateModuleStatus } = useCourseModule(courseModule.id);

  const { data: moduleRefUtxos } = api.moduleRefValidator.getUtxos.useQuery<ModuleRefUtxo[]>(
    { courseNftPolicy: courseNftPolicyId },
    {
      enabled: courseModule.status === ModuleStatus.PENDING_TX,
      refetchInterval: courseModule.status === ModuleStatus.PENDING_TX ? 10000 : false
    }
  );


  useEffect(() => {
    if (!moduleRefUtxos || courseModule.status !== ModuleStatus.PENDING_TX) return;
    setIsChecking(true);

    const matchingRef = moduleRefUtxos.find(ref => {
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
  }, [moduleRefUtxos, courseModule, courseNftPolicyId, updateModuleStatus]);

  return { moduleRefUtxos, isChecking };
}
