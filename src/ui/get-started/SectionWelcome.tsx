import Image from "next/image";

const pageCopy = [
  "The Andamio Platform is preparing to launch on Cardano's Preproduction Testnet. In collaboration with partners from across the Cardano ecosystem, we are preparing a set of high-impact courses. Andamio will launch on Mainnet Q4 2024.",
  'You can start exploring the Andamio Course Platform by viewing the courses listed below. In "Getting Started With Andamio", you can jump right into the Andamio Platform. Gimbalabs and Mesh are currently releasing "Plutus PBL" and "Mesh PBL" courses.',
];

export default function SectionWelcome() {
  return (
    <div className="mx-auto flex flex-col items-center gap-24 md:flex-row">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2>
          Welcome to Andamio
        </h2>
        {pageCopy.map((pc, i) => (
          <p
            key={i}
            className="prose mx-auto my-6 w-5/6 text-left text-lg leading-8 text-primary-foreground"
          >
            {pc}
          </p>
        ))}
      </div>
      <div>
        <Image
          src="/andamio-logo-no-white-overflow.png"
          width={400}
          height={400}
          alt="andamio"
        />
      </div>
    </div>
  );
}
