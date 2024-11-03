import React from "react";
import { Card } from "~/components/ui/card";

export default function PlaceholderComponent({
  name,
  userStory,
  subItems,
  children,
}: {
  name: string;
  userStory?: string;
  subItems?: string[];
  children?: React.ReactElement;
}) {
  return (
    <Card className="mx-auto my-5 flex h-full min-h-32 w-full flex-col items-center justify-center border border-primary">
      <p className="text-xl">{name}</p>
      {userStory && <p className="uppercase">{userStory}</p>}
      <div className="mx-auto mt-5 flex flex-col">{children}</div>
      {subItems && (
        <div className="mt-5 grid w-full grid-cols-1 gap-3">
          {subItems.map((item, i) => (
            <Card
              className="mx-auto flex min-h-20 w-full flex-col items-center justify-center bg-primary text-primary-foreground"
              key={i}
            >
              {item}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
