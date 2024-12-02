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
          ? "text-accent-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        "group flex flex-col rounded-md text-sm font-semibold leading-6",
      )}
    >

      {current && (
        <AndamioDashboardMenu />
      )}
    </li>
  );
}
