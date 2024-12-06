import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface ProjectTreasuryBalanceProps {
  treasuryId: string;
}

export default function ProjectFundingSummaryTable({ treasuryId }: ProjectTreasuryBalanceProps) {

  const { treasuryAmountsByStatus } = useTreasury(treasuryId);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Tasks</TableHead>
              <TableHead className="text-right">ADA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!treasuryAmountsByStatus && Object.entries(treasuryAmountsByStatus.amounts)
              .filter(([_, values]) => values.count > 0)
              .map(([status, values]) => (
                <TableRow key={status}>
                  <TableCell className="font-medium">
                    {status.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className="text-right">{values.count}</TableCell>
                  <TableCell className="text-right">{values.totalAda}{" "}<span className="text-gray-500 text-sm">₳</span></TableCell>
                </TableRow>
              ))}
            <TableRow className="bg-muted/50">
              <TableCell className="font-bold">TOTAL</TableCell>
              <TableCell className="text-right font-bold">
                {treasuryAmountsByStatus?.summary.totalTasks}
              </TableCell>
              <TableCell className="text-right font-bold">
                {treasuryAmountsByStatus?.summary.totalAda}{" "}<span className="text-gray-500 text-sm">₳</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
