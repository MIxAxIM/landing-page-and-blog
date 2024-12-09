
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import { deserializeTx } from "@meshsdk/core-csl";
import { useEffect, useState } from "react";
import MintModuleTokens from "~/components/cardano/tx/course-creator/mint-module-tokens/MintModuleTokens";
import { ToggleTextBox } from "~/components/ui/toggle-text-box";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { InfoTooltip } from "~/components/ui/InfoTooltip";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface CostDescription {
  txOutputIndex: number,
  description: string,
  tooltipText: string,
}

export interface CostBreakdown {
  costDescriptions: CostDescription[],
  cardanoTxFee?: number,
  andamioNetworkFee: number,
}

interface TxFeeDetail {
  costDescription: CostDescription,
  lovelaceAmount: number,
}

export default function TransactionCostDetails({ unsignedTxCBOR, costBreakdown }: { unsignedTxCBOR: string, costBreakdown: CostBreakdown }) {

  const testTx = deserializeTx(unsignedTxCBOR).to_js_value();

  const [txFeeDetails, setTxFeeDetails] = useState<TxFeeDetail[] | undefined>(undefined)
  const [total, setTotal] = useState<number | undefined>(undefined)


  const mockExchangeRate = 1.15 // from API?

  const cardanoTxFee = parseInt(testTx.body.fee)
  useEffect(() => {
    if (costBreakdown) {
      const _txFeeDetails: TxFeeDetail[] = costBreakdown.costDescriptions.map((costDescription) => ({
        costDescription,
        lovelaceAmount: parseInt(testTx.body.outputs[costDescription.txOutputIndex].amount.coin)
      }))
      setTxFeeDetails(_txFeeDetails)
    }
  }, [costBreakdown])

  useEffect(() => {
    const _total = (txFeeDetails?.reduce((sum, detail) => sum + detail.lovelaceAmount, 0) ?? 0)
      + (cardanoTxFee)
      + (costBreakdown.andamioNetworkFee)
    setTotal(_total / 1000000)
  }, [txFeeDetails, costBreakdown])
  return (
    <Card className="w-full max-w-2xl mx-auto text-sm">
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Review the itemized costs before proceeding with payment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!!txFeeDetails && txFeeDetails.map((fee, key) => (
          <div key={key} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>{fee.costDescription.description}</span>
              <InfoTooltip content={fee.costDescription.tooltipText} />
            </div>
            <span>{fee.lovelaceAmount / 1000000} ADA</span>
          </div>
        ))}
        <div key="cardanoFee" className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Cardano Tx Fee</span>
            <InfoTooltip content="Cardano tx fee" />
          </div>
          <span>{cardanoTxFee / 1000000} ADA</span>
        </div>
        <div key="andamioFee" className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Andamio Network Fee</span>
            <InfoTooltip content="Cost of using Andamio Network" />
          </div>
          <span>{costBreakdown.andamioNetworkFee / 1000000} ADA</span>
        </div>
        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span>{total} ADA (~${!!total && (total * mockExchangeRate).toFixed(2)} USD)</span>
        </div>
      </CardContent>
      <div className="mt-6 p-4 bg-muted rounded-md">
        <h3 className="font-semibold mb-2">Refund and Adjustment Policies</h3>
        <p className="text-sm text-muted-foreground">
          Refunds are available within 14 days of purchase if the project hasn't started.
          Adjustments to costs may occur if project requirements change significantly.
          Please contact support for more information.
        </p>
      </div>
    </Card>


  )
}


//<div className="pt-4">
//  <Label htmlFor="treasury-amount">Treasury Amount (ADA)</Label>
//  <Input
//    id="treasury-amount"
//    type="number"
//    value={treasuryAmount}
//    onChange={handleTreasuryChange}
//    className="mt-1"
//  />
//  <p className="text-sm text-muted-foreground mt-1">
//    Adjusting the treasury amount will affect the Treasury Setup Fees.
//  </p>
//</div>
//<PaymentPreviewModal
//  isOpen={isPreviewOpen}
//  onClose={() => setIsPreviewOpen(false)}
//  costBreakdown={costBreakdown}
//  onConfirm={handlePayment}
///>
//{error && (
//  <Alert variant="destructive" className="mt-4">
//    <AlertTitle>Error</AlertTitle>
//    <AlertDescription>{error}</AlertDescription>
//  </Alert>
//)}
//<PostPaymentSummary
//  isOpen={isPaymentSuccessful}
//  onClose={() => setIsPaymentSuccessful(false)}
//  costBreakdown={costBreakdown}
//  transactionId={transactionId}
///>
//
//<CardFooter>
//  <Button className="w-full" onClick={() => setIsPreviewOpen(true)}>Proceed to Payment</Button>
//</CardFooter>
