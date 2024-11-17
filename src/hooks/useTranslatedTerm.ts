import { useTerminology } from '~/contexts/terminology-context';
import type { TerminologyKeys } from '~/types/terminology';

export function useTranslatedTerm(key: TerminologyKeys) {
  const { translate } = useTerminology();
  return translate(key);
}
