import Image from "next/image";
import Link from "next/link";

export default function SuccessTxModalContent({
  txName,
  nextStepLinks,
  txHash,
}: {
  txName: string;
  nextStepLinks: { text: string; url: string }[];
  txHash: string;
}) {
  return (
    <div className="flex flex-col content-center items-center gap-3 py-5">
      <h2>Successful {txName} Transaction</h2>

      <h2>
        Next Steps:
      </h2>
      <ul className="mb-5 ml-3 w-5/6 list-disc">
        {nextStepLinks.map((l, i) => (
          <li key={i} className="ml-3 pl-1 font-semibold hover:text-primary">
            <Link href={l.url}>{l.text}</Link>
          </li>
        ))}
      </ul>
      <p className="mb-5">
        <Link href={`https://preprod.cardanoscan.io/transaction/${txHash}`}>
          View Tx On Cardano
        </Link>
      </p>
      <Image
        src="/andamio-logo-no-white-overflow.png"
        width={80}
        height={80}
        alt="andamio"
      />
    </div>
  );
}
