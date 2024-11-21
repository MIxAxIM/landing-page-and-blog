
import React from "react";

export default function TransactionPlaceholderComponent({
  name,
  children,
}: {
  name: string;
  children?: React.ReactElement;
}) {
  return (
    <div className="mx-4 flex flex-col items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm">
      <p className="text-xl">{name}</p>
      <div className="mx-auto mt-5 flex flex-col">{children}</div>
    </div>
  );
}
