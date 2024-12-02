import { useEffect, useState } from "react";
import Metatags from "~/components/common/metatags";
import PageCourse from "~/ui/course/[coursecode]/PageCourse";
import Footer from "~/ui/landing/Footer";
import SB7PageLanding from "~/ui/landing/SB7PageLanding";
import { api } from "~/utils/api";

export default function Landing() {
  const [host, setHost] = useState<undefined | string>(undefined);

  const { data: client } = api.clientDomains.getCourseCodeFromHost.useQuery(
    {
      host: host!,
    },
    {
      enabled: host !== undefined,
    },
  );

  useEffect(() => {
    const host = window.location.host;
    setHost(host);
  }, []);

  return (
    <>
      <Metatags />
      {client !== undefined ? (
        <>
          {client ? (
            <PageCourse courseId={client.courseId} />
          ) : (
            // <PageLanding />
            <SB7PageLanding />
          )}
        </>
      ) : (
        // <PageLanding />
        <SB7PageLanding />
      )}
      <Footer />
    </>
  );
}
