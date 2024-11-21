import { Card } from "~/components/ui/card";

export default function DashboardDataComponent({
  title,
  data,
}: {
  title: string;
  data: string;
}) {
  return (
    <Card className=" flex w-full flex-col border border-primary p-3 text-center">
      <p className="text-2xl">
        <b>{data}</b>
      </p>
      <div className="mt-auto ">{title}</div>
    </Card>
  );
}
