import MenuBar from "~/ui/landing/MenuBar";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const AndamioComponent = () => {
  useEffect(() => {
    const countdownElement = document.getElementById("countdown");
    const targetDate = new Date("2024-11-15T00:00:00").getTime();

    const countdownTimer = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = targetDate - now;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (countdownElement) {
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }

      if (timeLeft < 0) {
        clearInterval(countdownTimer);
        if (countdownElement) {
          countdownElement.innerHTML = "Voting has closed!";
        }
      }
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  return (
    <div className="flex h-lvh flex-col bg-white">
      <MenuBar />
      <main className="relative mx-auto flex h-lvh w-full flex-col items-start justify-end px-4 py-4 text-start md:w-11/12">
        <h3 className="w-full border-b-2 border-primary pb-2 text-4xl font-black uppercase text-secondary sm:text-2xl md:text-4xl lg:text-5xl">
          The Benefits of Voting for Andamio
        </h3>
        <div className="flex w-full flex-col gap-4 md:flex-col lg:flex-row">
          {/* Benefits Section */}
          <div className="grid w-full grid-cols-1 gap-8 border-b-2 border-primary py-6 md:grid-cols-3 lg:grid-cols-3">
            <div className="flex flex-col items-start text-start">
              <h4 className="text-lg font-bold text-primary sm:text-xl">
                Enterprise-ready Solution
              </h4>
              <p className="text-darkGreyText text-sm font-light">
                Andamio leverages Cardano’s robust blockchain technology to
                onboard enterprises efficiently, supporting ecosystem growth and
                driving adoption.
              </p>
            </div>
            <div className="flex flex-col items-start text-start">
              <h4 className="text-lg font-bold text-primary sm:text-xl">
                Next-Generation Smart Contracts
              </h4>
              <p className="text-darkGreyText text-sm font-light">
                Our next-generation smart contracts are built to optimize and
                automate business processes, ensuring scalability, transparency,
                and trust in every transaction.
              </p>
            </div>
            <div className="flex flex-col items-start text-start">
              <h4 className="text-lg font-bold text-primary sm:text-xl">
                Transparent On-Chain Operations
              </h4>
              <p className="text-darkGreyText text-sm font-light">
                Utilize streamlined, verifiable on-chain transactions that
                prioritize efficiency and security, designed to meet the demands
                of growing transaction volumes and support long-term ecosystem
                sustainability.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-4   py-6 md:flex-row">
          {/* Vote Button */}
          <Link href="https://projectcatalyst.io/search?q=andamio">
            <Button className="rounded bg-primary px-12 py-4 text-lg font-bold uppercase text-white shadow-primary transition-all duration-300 hover:bg-opacity-90">
              Vote for Andamio in Fund 13
            </Button>
          </Link>
          {/* Countdown Component */}
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 border-l-2 border-primary pl-4 md:flex-row md:gap-8">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">
              Time is Running Out to Vote!
            </h2>
            <div
              id="countdown"
              className="text-2xl font-extrabold text-secondary md:text-3xl"
            ></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary py-6 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
          <div className="flex items-center gap-4">
            <a href="https://x.com/AndamioPlatform" className="mx-2">
              <Image
                src="/logo-white.png"
                alt="Twitter"
                className="inline h-6 w-6"
                width={48}
                height={48}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/andamio-platform"
              className="mx-2"
            >
              <Image
                src="/In-White.png"
                alt="LinkedIn"
                className="inline h-6 w-6"
                width={48}
                height={48}
              />
            </a>
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm">© 2024 Andamio. All rights reserved.</p>
            <p className="text-sm">Built for the Cardano Summit 2024.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AndamioComponent;
