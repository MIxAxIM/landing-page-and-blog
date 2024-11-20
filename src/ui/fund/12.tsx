import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const proposals = [
  {
    title: "FC Barcelona + Community management + Using Cardano tech",
    description:
      "Using Cardano-native technology to onboard members, train them, encourage contributions, and build their reputation within the Barça fan community.",
    link: "https://cardano.ideascale.com/c/idea/125751",
  },
  {
    title: "Andamio Purpose Sidechain / Layer 2 Concept",
    description:
      "Implementing a purpose-built Cardano network sidechain with Layer 2 solutions to streamline and secure educational transactions and data management.",
    link: "https://cardano.ideascale.com/c/idea/122585",
  },
  {
    title: "Adapting On-Chain Reputation to Catalyst Voices",
    description:
      "Contribute to the progress of Catalyst Voices by implementing on-chain, role-based reputation-building capabilities.",
    link: "https://cardano.ideascale.com/c/idea/122267",
  },
  {
    title: "Enabling Advanced Contribution and Skills Tracking via APIs",
    description:
      "Enabling seamless integration of contribution tracking and token creation capabilities into existing applications via robust API services.",
    link: "https://cardano.ideascale.com/c/idea/122101",
  },
  {
    title: "Skills and contribution infrastructure on Cardano",
    description:
      "Andamio infrastructure enables skills acquisition and connecting to contribution opportunities to achieve the highest levels of community engagement and efficiency of work.",
    link: "https://cardano.ideascale.com/c/idea/122087",
  },
  {
    title: "Developing a Self Sovereign On-chain Identity (SSOI)",
    description:
      "Develop a decentralized identity solution on Cardano that grants users full control over their identity while leveraging the blockchain's security and transparency.",
    link: "https://cardano.ideascale.com/c/idea/122055",
  },
];

export default function Fund12() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <>
      <div className="">
        <main className="isolate">
          <div className="relative pt-14">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                  <h1>
                    Andamio, Build Trust.
                  </h1>

                  <p className="mt-6 text-xl leading-8 text-gray-600"></p>
                </div>
                <div className="mt-16 flow-root sm:mt-24">
                  <div className="-m-2 grid gap-4 p-2 md:grid-cols-2 lg:-m-4 lg:rounded-2xl lg:p-4">
                    {proposals.map((proposal) => (
                      <Card key={proposal.title}>
                        <CardHeader>
                          <CardTitle>{proposal.title}</CardTitle>
                        </CardHeader>
                        <CardContent>{proposal.description}</CardContent>
                        <CardFooter>
                          <Link href={proposal.link} target="_blank">
                            <Button>Read more</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
