import Link from "next/link";
import { Button } from "~/components/ui/button";

export function OrganizationHero() {
  return (
    <div className="relative mx-auto flex h-[80vh] w-full flex-col items-start justify-center px-8 text-start md:px-12 lg:justify-end">
      <div className="w-full border-b-2 border-primary pb-4">
        <h1 className="text-4xl font-black uppercase text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          Build Organizations That Work
        </h1>
        <h3 className="mt-4 max-w-full text-lg font-bold uppercase text-secondary sm:text-xl md:text-2xl lg:max-w-6xl">
          Fast onboarding with verified skills and secure payments.
        </h3>
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-4 border-b-2 border-primary py-6 lg:flex-row">
        {/* Value Propositions */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 border-primary md:grid-cols-3 md:pr-4 ">
          {/* Onboarding Efficiency*/}
          <div className="flex flex-col items-start text-start">
            <h4 className="text-lg font-bold text-primary sm:text-xl">
              Onboarding Efficiency
            </h4>
            <p className="sm:text-md text-sm font-light">
              Onboard talent in record time, with training tailored to your
              specific needs.
            </p>
          </div>

          {/* Verified Skills */}
          <div className="flex flex-col items-start text-start">
            <h4 className="text-lg font-bold text-primary sm:text-xl">
              Verified Skills
            </h4>
            <p className="sm:text-md text-sm font-light">
              Ensure every contributor’s skills are verified on-chain before
              they begin work.
            </p>
          </div>

          {/* Transparent Payments */}
          <div className="flex flex-col items-start text-start">
            <h4 className="text-lg font-bold text-primary sm:text-xl">
              Transparent Payments
            </h4>
            <p className="sm:text-md text-sm font-light">
              Ensure fair, transparent payments with blockchain and smart
              contracts.
            </p>
          </div>
        </div>
        <div className="lg-border-2 mt-4 flex  flex-row items-center gap-2 pl-2 md:mt-0 md:w-auto md:gap-4 lg:border-l-2 lg:border-primary">
          <Link href="/org">
            <Button className="text-md font-montserrat rounded border-2 border-primary bg-primary px-6 py-2 font-semibold uppercase text-white transition-all duration-300 hover:border-primary hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </Link>
          <Link href="/get-started">
            <Button className="text-md rounded border-2 border-primary bg-transparent px-6 py-2 font-semibold uppercase text-primary transition-all duration-300 hover:bg-primary hover:text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
