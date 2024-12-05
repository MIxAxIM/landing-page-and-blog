import AddFundsDialog from "~/components/cardano/tx/treasury/add-funds/AddFundsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface Fund {
  amount: number;
}

interface TreasuryInfo {
  funds: Fund[];
}

interface ProjectTreasuryBalanceProps {
  treasuryInfo?: TreasuryInfo;
  treasuryNftPolicyId: string;
  className?: string;
}

export default function ProjectTreasuryBalance({ treasuryInfo, treasuryNftPolicyId, className }: ProjectTreasuryBalanceProps) {
  // Calculate total balance in ADA
  const totalBalance = treasuryInfo?.funds.reduce((sum, fund) => sum + fund.amount, 0) ?? 0;
  const totalAda = totalBalance / 1_000_000;

  // Format ADA with 6 decimal places and commas for thousands
  const formattedAda = totalAda.toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Project Treasury Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">₳ {formattedAda}</span>
        </div>
        <AddFundsDialog treasuryNftPolicyId={treasuryNftPolicyId} />
      </CardContent>
    </Card>
  );
}
