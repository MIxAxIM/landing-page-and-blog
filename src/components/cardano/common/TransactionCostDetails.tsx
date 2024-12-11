
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { deserializeTx } from "@meshsdk/core-csl";
import { useEffect, useState } from "react";
import { InfoTooltip } from "~/components/ui/InfoTooltip";
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";
import { useWallet } from "@meshsdk/react";

// From a transaction Component, pass a list of costDescriptions
// For each output index, we can write a description and tooltip text.
// By this method, any utxos can be ignored - only add descriptions of costs to user
interface CostDescription {
  txOutputIndex: number,
  description: string,
  tooltipText: string,
}

export interface CostBreakdown {
  costDescriptions: CostDescription[],
  andamioNetworkFee: number,
}

interface TxFeeDetail {
  costDescription: CostDescription,
  lovelaceAmount?: number,
}

// Future development - add a real-time Cardano cost API
const mockExchangeRate = 1.15 // from API?

export default function TransactionCostDetails({ unsignedTxCBOR, costBreakdown }: { unsignedTxCBOR?: string, costBreakdown: CostBreakdown }) {

  const [cardanoTxFee, setCardanoTxFee] = useState<number | undefined>(undefined)

  const { connected } = useWallet()

  const [txFeeDetails, setTxFeeDetails] = useState<TxFeeDetail[] | undefined>(costBreakdown.costDescriptions.map((cd) => ({ costDescription: cd, lovelaceAmount: undefined })))
  const [total, setTotal] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (unsignedTxCBOR) {
      const _txBody = deserializeTx(unsignedTxCBOR).to_js_value()
      setCardanoTxFee(parseInt(_txBody.body.fee))

      if (costBreakdown && !!_txBody) {
        const _txFeeDetails: TxFeeDetail[] = costBreakdown.costDescriptions.map((costDescription) => ({
          costDescription,
          lovelaceAmount: parseInt(_txBody.body.outputs[costDescription.txOutputIndex].amount.coin)
        }))
        setTxFeeDetails(_txFeeDetails)
      }
    }
  }, [unsignedTxCBOR])

  // Calculate total cost to user - should match what they see as net delta of tx when signing in wallet 
  useEffect(() => {
    const _total = (txFeeDetails?.reduce((sum, detail) => sum + (detail.lovelaceAmount ?? 0), 0) ?? 0)
      + (cardanoTxFee ?? 0)
      + (costBreakdown.andamioNetworkFee)
    setTotal(_total / 1000000)
  }, [txFeeDetails, costBreakdown])

  if (!connected) return

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
              {!!unsignedTxCBOR && <InfoTooltip content={fee.costDescription.tooltipText} />}
            </div>
            {!!fee.lovelaceAmount ? (
              <span>{fee.lovelaceAmount / 1000000} ADA</span>
            ) : (
              <LoadingCircle />
            )}
          </div>
        ))}
        <div key="cardanoFee" className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Cardano Tx Fee</span>
            {!!unsignedTxCBOR && <InfoTooltip content="Cardano tx fee" />}
          </div>
          {!!cardanoTxFee ? (
            <span>{(cardanoTxFee ?? 0) / 1000000} ADA</span>
          ) : (
            <LoadingCircle />
          )}
        </div>
        {costBreakdown.andamioNetworkFee > 0 && (
          <div key="andamioFee" className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Andamio Network Fee</span>
              {!!unsignedTxCBOR && <InfoTooltip content="Cost of using Andamio Network" />}
            </div>
            <span>{costBreakdown.andamioNetworkFee / 1000000} ADA</span>
          </div>
        )}
        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span>{total} ADA (~${!!total && (total * mockExchangeRate).toFixed(2)} USD)</span>
        </div>
      </CardContent>
      {!!unsignedTxCBOR && (
        <div className="mt-6 p-4 bg-muted rounded-md">
          <h3 className="font-semibold mb-2">Refund and Adjustment Policies</h3>
          <p className="text-sm text-muted-foreground">
            Refunds are available within 14 days of purchase if the project hasn't started.
            Adjustments to costs may occur if project requirements change significantly.
            Please contact support for more information.
          </p>
        </div>
      )}
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
