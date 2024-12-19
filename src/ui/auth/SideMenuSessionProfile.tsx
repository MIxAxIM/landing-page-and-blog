import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SideMenuSessionProfile() {
  const { data: sessionData } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (!sessionData) {
    return (
      <li className="m-5 mt-auto">
        <Link href={`/auth/signin`}>
          <span className="text-sm font-semibold leading-6 text-foreground">
            Log in <span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li className="mb-3 mt-auto">
      {isProfileMenuOpen && (
        <>
          <button className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none">
            <Link href="/dashboard">Dashboard</Link>
          </button>
          <button className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none">
            <Link href="/studio">Andamio Studio</Link>
          </button>
          <button
            onClick={() => void signOut({ callbackUrl: "/" })}
            className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none"
          >
            Sign Out
          </button>
        </>
      )}
      <a
        onClick={() => setIsProfileMenuOpen((prevState) => !prevState)}
        className="flex cursor-pointer items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-foreground hover:bg-accent"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-8 w-8 rounded-full bg-accent"
          src={sessionData.user?.image ?? ""}
          alt=""
        />
        <span className="sr-only">Your profile</span>
        <span aria-hidden="true">{sessionData.user?.name}</span>
      </a>
    </li>
  );
}
