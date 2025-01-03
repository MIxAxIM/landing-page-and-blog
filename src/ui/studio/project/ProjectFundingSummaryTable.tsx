import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/utils/shadcn";
import { type StatusConfig, StatusIcon, commitmentStatusConfig, taskStatusConfig } from "~/ui/project/status/TaskStatusIndicator";
import { type TreasuryAmountsByStatus } from "~/types/db";

interface ProjectTreasuryBalanceProps {
  treasuryAmountsByStatus: TreasuryAmountsByStatus;
}

export default function ProjectFundingSummaryTable({ treasuryAmountsByStatus }: ProjectTreasuryBalanceProps) {

  const StatusTable = ({
    data,
    config,
    summaryTitle,
    summaryData,
  }: {
    data: Record<string, { totalAda: number; count: number }>,
    config: Record<string, StatusConfig>
    summaryTitle: string,
    summaryData: { totalCount: number, totalAda: number }
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Tasks</TableHead>
          <TableHead className="text-right">ADA</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data)
          .filter(([_, values]) => values.count > 0)
          .map(([status, values]) => (
            <TableRow key={status}>
              <TableCell>
                {!!config[status] && !!config[status]?.color && (
                  <div className="flex items-center gap-2">
                    <StatusIcon config={config[status]!} />
                    <span className={cn("font-medium", config[status]?.color)}>
                      {status.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">{values.count}</TableCell>
              <TableCell className="text-right">
                {values.totalAda.toLocaleString()} <span className="text-accent">₳</span>
              </TableCell>
            </TableRow>
          ))}
        <TableRow className="bg-muted/50">
          <TableCell className="font-bold py-3">{summaryTitle}</TableCell>
          <TableCell className="font-bold text-center py-3">
            {summaryData.totalCount.toLocaleString()}
          </TableCell>
          <TableCell className="text-right font-bold py-3">
            {summaryData.totalAda.toLocaleString()}{" "}<span className="text-accent text-sm">₳</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  if (!treasuryAmountsByStatus) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-24">
          <div>
            <h3>Open Tasks</h3>
            <StatusTable
              data={treasuryAmountsByStatus.amounts.taskStatuses}
              config={taskStatusConfig}
              summaryTitle="TOTAL TASKS"
              summaryData={treasuryAmountsByStatus.summary.tasks}
            />
          </div>
          <div>
            <h3>Task Commitments</h3>
            <StatusTable
              data={treasuryAmountsByStatus.amounts.commitmentStatuses}
              config={commitmentStatusConfig}
              summaryTitle="TOTAL COMMITMENTS"
              summaryData={treasuryAmountsByStatus.summary.commitments}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
