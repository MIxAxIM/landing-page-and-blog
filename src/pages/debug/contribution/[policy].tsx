import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const PolicyPage: React.FC = () => {
  const router = useRouter();
  const { policy } = router.query;

  const { data: treasuryInfo } = api.projectGeneral.getTreasuryInfo.useQuery({
    policy: policy as string,
  });

  return (
    <div>
      <h1>{policy}</h1>
      <Link href={`./${policy as string}/escrow`}>
        <Button>Escrow</Button>
      </Link>
      <br />
      <br />
      <h1>FUNDS</h1>
      <Link href={`./${policy as string}/add-funds`}>
        <Button>Add Funds</Button>
      </Link>
      <pre>{JSON.stringify(treasuryInfo?.info.funds, null, 2)}</pre>
      <br />
      <h1>Projects</h1>
      <Button>Create Project</Button>
      <div>
        <br />
        {treasuryInfo?.info.projects.map((project: any) => {
          return (
            <div key={project.id}>
              <pre>{JSON.stringify(project, null, 2)}</pre>
              <Link href={`./${policy as string}/commit`}>
                <Button>Commit</Button>
              </Link>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyPage;
