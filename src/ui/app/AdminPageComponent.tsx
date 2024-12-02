import { Card, CardContent, CardHeader } from "~/components/ui/card";
import AdminCreateCourseInstanceStepOne from "~/components/cardano/dialogs/AdminCreateCourseInstanceStepOne";
import AdminCreateCourseInstanceStepTwo from "~/components/cardano/dialogs/AdminCreateCourseInstanceStepTwo";
import { CardanoWallet } from "@meshsdk/react";
import AdminCreateCourseInstanceStepThree from "~/components/cardano/dialogs/AdminCreateCourseInstanceStepThree";
import AdminAddTeacherDialog from "~/components/cardano/dialogs/AdminAddTeacherDialog";
import AdminRemoveTeacherDialog from "~/components/cardano/dialogs/AdminRemoveTeacherDialog";
import AppLayout from "../app/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import AdminCreateProjectInstanceStepOne from "~/components/cardano/dialogs/AdminCreateProjectStepOne";
import AdminCreateProjectInstanceStepTwo from "~/components/cardano/dialogs/AdminCreateProjectStepTwo";
import AdminCreateProjectInstanceStepThree from "~/components/cardano/dialogs/AdminCreateProjectStepThree";
import AdminCreateProjectInstanceStepFour from "~/components/cardano/dialogs/AdminCreateProjectStepFour";

export default function AdminPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto grid w-11/12 grid-cols-1 gap-10">
        <CardanoWallet />
        <Accordion type="single" collapsible>
          <AccordionItem value="course-admin">
            <AccordionTrigger>Course Admin</AccordionTrigger>

            <AccordionContent>
              <Card>
                <CardHeader>Mint Course NFT with list of Contributors</CardHeader>
                <CardContent>
                  <AdminCreateCourseInstanceStepOne />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Deploy Reference Scripts</CardHeader>
                <CardContent>
                  <AdminCreateCourseInstanceStepTwo />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Deploy Course</CardHeader>
                <CardContent>
                  <AdminCreateCourseInstanceStepThree />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Add Teacher to Course</CardHeader>
                <CardContent>
                  <AdminAddTeacherDialog />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Remove Teacher from Course</CardHeader>
                <CardContent>
                  <AdminRemoveTeacherDialog />
                </CardContent>
              </Card>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="project-admin">
            <AccordionTrigger>Project Admin</AccordionTrigger>

            <AccordionContent>
              <Card>
                <CardHeader>Step 1: Initialize Project with Access Token Aliases</CardHeader>
                <CardContent>
                  <AdminCreateProjectInstanceStepOne />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Step 2: Deploy Reference Scripts?</CardHeader>
                <CardContent>
                  <AdminCreateProjectInstanceStepTwo />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Step 3: Deploy Course</CardHeader>
                <CardContent>
                  <AdminCreateProjectInstanceStepThree />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Step 4: Add Prerequisites</CardHeader>
                <CardContent>
                  <AdminCreateProjectInstanceStepFour />
                </CardContent>
              </Card>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </AppLayout>
  );
}
