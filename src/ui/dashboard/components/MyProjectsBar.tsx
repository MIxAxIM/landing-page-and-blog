import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import Loading from "~/components/common/loading";
import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import { useEffect, useState } from "react";
import { type AggregateUserInfoResponse } from "@andamiojs/datum-utils";
import Image from "next/image";
import { type Treasury } from "~/types/db";

export function MyProjectsBar({
  aggregateUserInfo,
}: {
  aggregateUserInfo: AggregateUserInfoResponse | undefined;
}) {
  const { treasuries, isLoadingTreasuries } = useTreasuries();
  const [myProjects, setMyProjects] = useState<Treasury[]>([]);

  useEffect(() => {
    if (aggregateUserInfo) {
      const myOnchaincourse = aggregateUserInfo.projects.ongoing.map(
        (project) => project.policy,
      );
      if (treasuries) {
        const myProjects = treasuries.filter((treasury) =>
          myOnchaincourse.some(
            (onchainCourse) => onchainCourse === treasury.treasuryNftPolicyId,
          ),
        );
        setMyProjects(myProjects);
      }
    }
  }, [aggregateUserInfo, isLoadingTreasuries, treasuries]);

  return (
    <div className="explore-projects-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">My Projects</div>
        <div></div>
      </h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {(isLoadingTreasuries || !aggregateUserInfo) && <Loading />}
          {!isLoadingTreasuries &&
            aggregateUserInfo &&
            treasuries &&
            myProjects.length === 0 ? (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-800 text-white shadow-md">
              <p>You have not joined any projects yet.</p>
              <Link href="/projects" passHref>
                <Button className="ml-4">Explore Projects</Button>
              </Link>
            </div>
          ) : (
            treasuries &&
            myProjects.map((treasury) => (
              <Link
                href={`/project/${treasury.treasuryNftPolicyId}`}
                passHref
                key={treasury.id}
                className="item min-w-[180px] transform rounded-lg bg-gray-800 text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              >
                <Image
                  src={`images/sample-covers/2.jpg`}
                  alt={treasury.title}
                  className="h-40 w-full rounded-t-lg object-cover"
                />
                <div className="p-2">
                  <p className="font-bold">{treasury.title}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
