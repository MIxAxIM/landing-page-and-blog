
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useTerminology } from "~/contexts/terminology-context";
import EscrowAcceptanceCriteriaForm from "./EscrowAcceptanceCriteriaForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ProjectAcceptanceCriteria({ escrowId }: { escrowId: string }) {
  const { translate, translateCaps, translateCapsPlural } = useTerminology()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translateCaps('escrow')} {translateCaps('acceptanceCriteria')}
        </CardTitle>
        <p className="prose">
          For any {translate('escrow')}, you can create a list of pre-defined
          {translateCaps('acceptanceCriteria')} that will be preloaded into new {translateCapsPlural("task")}.
        </p>
      </CardHeader>
      <CardContent>
        {!!escrowId && (
          <EscrowAcceptanceCriteriaForm escrowId={escrowId} />
        )}
      </CardContent>
    </Card>

  )
}
