import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";
import { Card } from "~/components/ui/card"

interface Fund {
  amount: number;
}

interface TreasuryInfo {
  funds: Fund[];
}

interface ProjectTreasuryBalanceProps {
  treasuryInfo?: TreasuryInfo;
  treasuryNftPolicyId: string;
  isLoading?: boolean;
}

export default function ProjectTreasuryBalance({ treasuryInfo, isLoading }: ProjectTreasuryBalanceProps) {
  // Calculate total balance in ADA
  const totalBalance = treasuryInfo?.funds.reduce((sum, fund) => sum + fund.amount, 0) ?? 0;
  const totalAda = totalBalance / 1_000_000;

  // Format ADA with 6 decimal places and commas for thousands
  const formattedAda = totalAda.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 6
  });


  return (
    <Card className="flex flex-row gap-x-4 items-center">
      <p>Project Treasury Balance</p>
      <div className="flex items-center space-x-2 min-w-28">
        {isLoading ? (
          <LoadingCircle />
        ) : (
          <span className="text-lg font-bold">{formattedAda} ada</span>
        )}
      </div>
    </Card>
  );
}
