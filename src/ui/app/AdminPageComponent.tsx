import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { CardanoWallet } from "@meshsdk/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import AppLayout from "~/components/layout/AppLayout";
import AddCourseCreatorsDialog from "~/components/cardano/tx/admin/add-course-creators/AddCourseCreatorsDialog";
import RmCourseCreatorsDialog from "~/components/cardano/tx/admin/rm-course-creators/RmCourseCreatorsDialog";
import InitProjectStep1Dialog from "~/components/cardano/tx/admin/init-project-step-1/InitProjectStep1Dialog";
import InitProjectStep2Dialog from "~/components/cardano/tx/admin/init-project-step-2/InitProjectStep2Dialog";
import InitCourseStep1Dialog from "~/components/cardano/tx/admin/init-course/InitCourseDialog";

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
                  <InitCourseStep1Dialog />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Add Teacher to Course</CardHeader>
                <CardContent>
                  <AddCourseCreatorsDialog />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Remove Teacher from Course</CardHeader>
                <CardContent>
                  <RmCourseCreatorsDialog />
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
                  <InitProjectStep1Dialog />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Step 2: Add Prerequisites</CardHeader>
                <CardContent>
                  <InitProjectStep2Dialog />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </AppLayout>
  );
}
