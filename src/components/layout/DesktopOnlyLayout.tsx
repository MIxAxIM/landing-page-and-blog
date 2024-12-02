import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "../ui/button";

export default function DesktopOnlyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {/* Hide desktop layout on small screens */}
      <div className="block md:hidden">
        <div className="mx-auto flex h-screen w-5/6 flex-col items-center justify-center gap-10">
          <Link href="/">
            <Image
              src="/andamio-logo-no-white-overflow.png"
              width={200}
              height={200}
              alt="andamio"
            />
          </Link>

          <p className=" ">
            The Andamio App is currently built for desktop browsers.
          </p>
          <p className="">
            Please stay tuned for updates about development of the Andamio
            Mobile App.
          </p>
          <Link href="/contact">
            <Button size="heroBlack">Get in Touch</Button>
          </Link>
        </div>
      </div>

      {/* Show desktop layout on medium and larger screens */}
      <div className="hidden md:block">{children}</div>
    </div>
  );
}
