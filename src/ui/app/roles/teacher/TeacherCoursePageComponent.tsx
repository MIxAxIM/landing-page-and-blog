import { useWallet } from "@meshsdk/react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
import TeacherSection from "./TeacherSection";
import TeacherConnectWalletCard from "./TeacherConnectWalletCard";

export default function TeacherCoursePageComponent({
  courseCode,
}: {
  courseCode: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();
  return (
    <div className="mx-auto mt-12 flex w-5/6 items-center justify-center">
      {connected ? (
        <TeacherSection
          accessTokenAlias={accessTokenAlias ?? ""}
          courseCode={courseCode}
        />
      ) : (
        <TeacherConnectWalletCard />
      )}
    </div>
  );
}
