import { BoxIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "~/components/ui/button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export default function RoleStatus({
  roleName,
  userHasRole,
  roleDetail,
  roleInfoUrl,
  current,
}: {
  roleName: string;
  userHasRole: boolean;
  roleDetail?: string;
  roleInfoUrl?: string;
  current?: boolean;
}) {
  if (!userHasRole) return;
  return (
    <li
      className={classNames(
        current
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-primary hover:text-primary-foreground",
        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
      )}
    >
      <div className="flex items-center justify-center">
        {userHasRole ? (
          <CheckCircledIcon className="h-6 w-6" />
        ) : (
          <BoxIcon className="h-6 w-6" />
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-sm font-semibold">
          {roleName}
          {!!roleDetail && `: ${roleDetail}`}
        </div>
        {roleInfoUrl && (
          <Link href={roleInfoUrl} className="">
            <Button size="sm" intent="secondary">
              view
            </Button>
          </Link>
        )}
      </div>
    </li>
  );
}
