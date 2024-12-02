import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function MobileTopbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {
  const { data: sessionData } = useSession();

  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-foreground lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
        Learning Platform
      </div>
      <span className="sr-only">Your profile</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-8 w-8 rounded-full bg-accent"
        src={sessionData?.user?.image ?? ""}
        alt=""
      />
    </div>
  );
}
