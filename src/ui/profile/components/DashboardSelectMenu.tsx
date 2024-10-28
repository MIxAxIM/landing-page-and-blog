import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter } from "next/router";
import classNames from "~/utils/classnames";

export default function DashboardSelectMenu({
  title,
  dashboardRoute,
  currentItemCode,
  courseInfos,
  treasuryInfos,
  placeholder,
}: {
  title: string;
  dashboardRoute: string;
  currentItemCode: string;
  courseInfos?: { courseCode: string; title: string }[];
  treasuryInfos?: { treasuryCode: string; title: string }[];
  placeholder: string;
}) {
  const router = useRouter();

  const pushRoute = (courseCode: string) => {
    void router.push(`/${dashboardRoute}/${courseCode}`);
  };

  if (!courseInfos && !treasuryInfos) return;

  return (
    <div className="flex flex-col p-3">
      <h2>{title}</h2>
      <Select value={currentItemCode} onValueChange={pushRoute}>
        <SelectTrigger className="bg-background text-sm font-semibold leading-6 text-foreground">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent role="list" className="my-2 space-y-1">
          {courseInfos?.map((listItem) => (
            <SelectItem key={listItem?.courseCode} value={listItem.courseCode}>
              <div className="flex flex-row gap-2">
                <span
                  className={classNames(
                    router.query.coursecode == listItem?.courseCode
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-accent-foreground text-accent-foreground group-hover:border-primary group-hover:text-accent-foreground",
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-secondary text-[0.625rem] font-medium",
                  )}
                >
                  {listItem?.title.substring(0, 1)}
                </span>
                <span className="truncate">{listItem?.title}</span>
              </div>
            </SelectItem>
          ))}
          {treasuryInfos?.map((listItem) => (
            <SelectItem
              key={listItem?.treasuryCode}
              value={listItem.treasuryCode}
            >
              <div className="flex flex-row gap-2">
                <span
                  className={classNames(
                    router.query.treasurycode == listItem?.treasuryCode
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-accent-foreground text-accent-foreground group-hover:border-primary group-hover:text-accent-foreground",
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-secondary text-[0.625rem] font-medium",
                  )}
                >
                  {listItem?.title.substring(0, 1)}
                </span>
                <span className="truncate">{listItem?.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
