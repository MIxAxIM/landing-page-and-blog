

import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import AppLayout from "../app/layout/AppLayout";
import PlaceholderComponent from "../prototype/PlaceholderComponent";
import TeacherSection from "./roles/teacher/TeacherSection";
import { CardanoWallet } from "@meshsdk/react";
import useUserRelationships from "~/hooks/app/useUserRelationships";
import { Card } from "~/components/ui/card";
import { useState } from "react";
import { Button } from "~/components/ui/button";


export default function TeacherPageComponent() {
  const { accessTokenAlias } = useAccessToken()
  const { courses } = useUserRelationships()
  const [currentCourseCode, setCurrentCourseCode] = useState<string | undefined>(undefined)


  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2>Teacher Page</h2>
        {!currentCourseCode && courses.asCreator.map((course, i) => (
          <Card key={i}>
            <h2>{course.title}</h2>
            <pre>Course NFT Policy Id: {course.onchainInstance[0]?.CourseCreatorNFTPolicyID}</pre>
            <Button onClick={() => setCurrentCourseCode(course.courseCode)}>View</Button>
          </Card>
        ))}
        <CardanoWallet />
        {!!accessTokenAlias && !!currentCourseCode && (
          <>
            <TeacherSection accessTokenAlias={accessTokenAlias} courseCode={currentCourseCode} />
          </>
        )}
        <PlaceholderComponent name="view courses in my organization" />
        <PlaceholderComponent name="view courses that I contribute to" />
        <PlaceholderComponent name="for reference, view all courses, but not in this view" />
      </div>
    </AppLayout>
  );
}
