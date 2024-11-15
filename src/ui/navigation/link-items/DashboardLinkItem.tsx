import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import AndamioDashboardMenu from "../menu-sections/AndamioDashboardMenu";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function DashboardLinkItem({
  current,
}: {
  current: boolean;
  dashboardChildRoute: string;
}) {
  return (
    <li
      key="dashboard"
      className={classNames(
        current
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        "group flex flex-col rounded-md p-2 text-sm font-semibold leading-6",
      )}
    >
      <Link
        href="/dashboard"
        className={classNames(
          current ? "mb-2" : "",
          "flex flex-row items-center gap-x-3",
        )}
      >
        <HomeIcon
          className={classNames(
            current
              ? "text-foreground"
              : "text-foreground group-hover:text-accent-foreground",
            "h-6 w-6 shrink-0",
          )}
          aria-hidden="true"
        />
        Andamio Dashboard
      </Link>

      {current && (
        <AndamioDashboardMenu />
      )}
    </li>
  );
}
