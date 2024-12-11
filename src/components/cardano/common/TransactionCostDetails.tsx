
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { deserializeTx } from "@meshsdk/core-csl";
import { useEffect, useState } from "react";
import { InfoTooltip } from "~/components/ui/InfoTooltip";
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";
import { useWallet } from "@meshsdk/react";
import maestro from "~/config/maestro";

// From a transaction Component, pass a list of costDescriptions
// For each output index, we can write a description and tooltip text.
// By this method, any utxos can be ignored - only add descriptions of costs to user
interface CostDescription {
  txInputIndexes?: number[],
  txOutputIndexes: number[],
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
  isPaidToUser?: boolean,
}

// Future development - add a real-time Cardano cost API
const mockExchangeRate = 1.15 // from API?

export default function TransactionCostDetails({ unsignedTxCBOR, costBreakdown }: { unsignedTxCBOR?: string, costBreakdown: CostBreakdown }) {

  const [cardanoTxFee, setCardanoTxFee] = useState<number | undefined>(undefined)

  const { connected } = useWallet()

  const [txFeeDetails, setTxFeeDetails] = useState<(TxFeeDetail | undefined)[] | undefined>(costBreakdown.costDescriptions.map((cd) => ({ costDescription: cd, lovelaceAmount: undefined })))
  const [total, setTotal] = useState<number | undefined>(undefined)
  useEffect(() => {
    if (!unsignedTxCBOR) return;

    const txBody = deserializeTx(unsignedTxCBOR).to_js_value().body;
    setCardanoTxFee(parseInt(txBody.fee));

    const fetchTxDetails = async () => {
      const details = await Promise.all(
        costBreakdown.costDescriptions.map(async (costDescription) => {
          // Simple case: no inputs and single output
          if (!costDescription.txInputIndexes?.length && costDescription.txOutputIndexes.length === 1) {
            return {
              costDescription,
              lovelaceAmount: parseInt(txBody.outputs[costDescription.txOutputIndexes[0] ?? 0].amount.coin)
            };
          }

          if (!!costDescription.txInputIndexes && !!costDescription.txInputIndexes[0] && costDescription.txOutputIndexes.length === 0) {
            const utxos = await maestro.fetchUTxOs(
              txBody.inputs[costDescription.txInputIndexes[0]].transaction_id,
              txBody.inputs[costDescription.txInputIndexes[0]].index
            )

            return {
              costDescription,
              lovelaceAmount: parseInt(utxos[0]?.output.amount[0]?.quantity ?? "0"),
              isPaidToUser: true
            };
          }

          // Complex case: need to fetch UTXOs
          try {
            const inputIndex = costDescription.txInputIndexes?.[0] ?? 0;
            const input = txBody.inputs[inputIndex];

            const utxos = await maestro.fetchUTxOs(
              input.transaction_id,
              input.index
            );

            const inputLovelace = parseInt(utxos[0]?.output.amount[0]?.quantity ?? "0");

            const outputSum = costDescription.txOutputIndexes.reduce(
              (sum, outputIndex) => sum + parseInt(txBody.outputs[outputIndex].amount.coin ?? "0"),
              0
            );

            return {
              costDescription,
              lovelaceAmount: outputSum - inputLovelace
            };
          } catch (error) {
            console.error('Error fetching UTXOs:', error);
            return {
              costDescription,
              lovelaceAmount: 0
            };
          }
        })
      );

      setTxFeeDetails(details);
    };

    void fetchTxDetails();
  }, [unsignedTxCBOR, costBreakdown]);

  // Calculate total cost to user - should match what they see as net delta of tx when signing in wallet 
  useEffect(() => {
    const _total = (txFeeDetails?.reduce((sum, detail) => sum + (detail?.lovelaceAmount ?? 0), 0) ?? 0)
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
              <span>{fee?.costDescription.description}</span>
              {!!unsignedTxCBOR && <InfoTooltip content={fee?.costDescription.tooltipText ?? ""} />}
            </div>
            {(!!fee?.lovelaceAmount || fee?.lovelaceAmount === 0) ? (
              <span className={`${fee.lovelaceAmount < 0 && "text-success font-bold"}`}>{Math.abs(fee.lovelaceAmount / 1000000)} ada</span>
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
          {(!!cardanoTxFee || cardanoTxFee === 0) ? (
            <span>{(cardanoTxFee ?? 0) / 1000000} ada</span>
          ) : (
            <span>0 ada</span>
          )}
        </div>
        {costBreakdown.andamioNetworkFee > 0 && (
          <div key="andamioFee" className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Andamio Network Fee</span>
              {!!unsignedTxCBOR && <InfoTooltip content="Cost of using Andamio Network" />}
            </div>
            <span>{costBreakdown.andamioNetworkFee / 1000000} ada</span>
          </div>
        )}
        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span className={`${total && total < 0 && "text-success font-bold"}`}>{Math.abs(total ?? 0)} ada (~${!!total && (Math.abs(total) * mockExchangeRate).toFixed(2)} USD)</span>
        </div>
      </CardContent>
      {!!unsignedTxCBOR && (
        <div className="mt-6 p-4 bg-muted rounded-md">
          <h3 className="font-semibold mb-2">Refund and Adjustment Policies</h3>
          <p className="text-sm text-muted-foreground">
            Todo: we need a refund policy?
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
