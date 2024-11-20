

import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import AppLayout from "../app/layout/AppLayout";
import PlaceholderComponent from "../prototype/PlaceholderComponent";
import TeacherSection from "./roles/teacher/TeacherSection";
import { CardanoWallet } from "@meshsdk/react";

export default function TeacherPageComponent() {
  const { accessTokenAlias } = useAccessToken()
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2 className="my-10 text-4xl">Teacher Page</h2>
        <CardanoWallet />
        {!!accessTokenAlias && (
          <>
            <h1>{accessTokenAlias}</h1>
            <TeacherSection accessTokenAlias={accessTokenAlias} courseCode="ppbl2025" />
          </>
        )}
        <PlaceholderComponent name="view courses in my organization" />
        <PlaceholderComponent name="view courses that I contribute to" />
        <PlaceholderComponent name="for reference, view all courses, but not in this view" />
      </div>
    </AppLayout>
  );
}
