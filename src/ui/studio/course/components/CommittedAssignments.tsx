import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Card } from "~/components/ui/card";
import useAssignmentDatums from "~/hooks/cardano-indexer-api/course/useAssignmentDatums";
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";
import useCourseByPolicyId from "~/hooks/cardano-indexer-api/course/useCourseByPolicyId";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AcceptDenyAssignmentDialog from "~/components/cardano/tx/course-creator/accept-deny-assignment/AcceptDenyAssignmentDialog";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";
import { useEffect, useState } from "react";
import { AssignmentCommitmentStatusIndicator } from "~/ui/course/components/ui/status/AssignmentStatusIndicators";
import type { AssignmentNetworkStatus, AssignmentPrivateStatus, Prisma } from "@prisma/client";
import { type DecodedAssignmentDecisionDatum } from "@andamiojs/datum-utils";
import { type AssignmentCommitment } from "~/types/db";
import { type Content, EditorContent, useEditor } from "@tiptap/react";
import { ExtensionKit } from "~/components/editor/extension-kit";

export default function CommittedAssignments({
  courseNftPolicy,
}: {
  courseNftPolicy: string;
}) {
  const [combinedData, setCombinedData] = useState<CombinedACData[] | null>(null);
  const { listCourseAssignmentDatums } = useAssignmentDatums(courseNftPolicy);
  const { accessTokenAsset } = useAccessToken();
  const { courseInfo, isLoadingCourseInfo } = useCourseByPolicyId(courseNftPolicy);
  const { assignmentCommitmentsAwaitingApproval, assignmentCommitmentsByCourse } = useAssignmentCommitment({
    courseCode: courseInfo?.courseCode
  });

  useEffect(() => {
    if (!listCourseAssignmentDatums || !assignmentCommitmentsAwaitingApproval) return;
    const _combinedData = combineAssignmentCommitmentData(
      assignmentCommitmentsAwaitingApproval,
      listCourseAssignmentDatums
    );
    setCombinedData(_combinedData);
  }, [listCourseAssignmentDatums, assignmentCommitmentsAwaitingApproval]);

  if (!courseNftPolicy) return null;
  if (isLoadingCourseInfo) return <LoadingCircle />;


  return (
    <div className="my-5 flex w-full flex-col border-t border-accent pt-5" key={courseNftPolicy}>
      <h2>Review Student Assignments</h2>

      <div className="flex flex-col w-full">
        {combinedData?.map((assignment) => (
          <Card key={assignment.commitmentId} className="my-3">
            <Accordion type="single" collapsible>
              <AccordionItem value={assignment.commitmentId}>
                <AccordionTrigger>
                  <div className="grid grid-cols-6 w-full items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{assignment.studentAlias}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm">{assignment.onChainAssignmentId}: {assignment.assignmentTitle}</p>
                    </div>
                    <div>
                      <AssignmentCommitmentStatusIndicator
                        privateStatus={assignment.privateStatus}
                        networkStatus={assignment.networkStatus}
                        showLabel={true}
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-4 justify-end">
                      {assignment.networkEvidenceHash ? (
                        <>
                          <AcceptDenyAssignmentDialog
                            assignmentCommitmentId={assignment.commitmentId}
                            courseNftPolicy={courseNftPolicy}
                            userAccessTokenUnit={accessTokenAsset!.unit}
                            studentAlias={assignment.studentAlias}
                            decision="accept"
                          />
                          <AcceptDenyAssignmentDialog
                            assignmentCommitmentId={assignment.commitmentId}
                            courseNftPolicy={courseNftPolicy}
                            userAccessTokenUnit={accessTokenAsset!.unit}
                            studentAlias={assignment.studentAlias}
                            decision="deny"
                          />
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No Assignment Info
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 py-6 space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-2">Network Evidence:</h4>
                        <ReadEvidenceContent content={assignment.networkEvidence as Content} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Assignment Details:</h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Evidence Hash:</span> {assignment.networkEvidenceHash}</p>
                          <p><span className="font-medium">On-chain Assignment ID:</span> {assignment.onChainAssignmentId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))}
      </div>
      <h2>Completed Assignments</h2>
      {assignmentCommitmentsByCourse?.filter(c => !!c.networkEvidenceHash).map((commitment) => (
        <Card key={commitment.id}>
          <div className="flex flex-row w-full items-center justify-between">
            <p>{commitment.assignment.title}: {commitment.networkEvidenceHash}</p>
            <AssignmentCommitmentStatusIndicator networkStatus={commitment.networkStatus} showLabel={true} />
          </div>
        </Card>
      ))}
    </div>
  );
}


interface CombinedACData {
  assignmentTitle: string;
  commitmentId: string;
  assignmentId: string;
  studentAlias: string;
  networkEvidence?: Prisma.JsonValue;
  networkEvidenceHash?: string | null;
  onChainAssignmentId: string;
  privateStatus: AssignmentPrivateStatus;
  networkStatus?: AssignmentNetworkStatus;
  status: string;
}

function combineAssignmentCommitmentData(
  commitments: AssignmentCommitment[],
  datums: DecodedAssignmentDecisionDatum[]
): CombinedACData[] {
  const combined: CombinedACData[] = [];

  for (const datum of datums) {
    // Find matching commitment based on networkEvidenceHash
    const matchingCommitment = commitments.find(commitment =>
      datum?.StudentAssignmentInfo?.includes(commitment.networkEvidenceHash!)
    );

    if (matchingCommitment) {
      combined.push({
        assignmentTitle: matchingCommitment.assignment.title,
        commitmentId: matchingCommitment.id,
        assignmentId: matchingCommitment.assignmentId,
        studentAlias: datum.CourseUserName,
        networkEvidence: matchingCommitment.networkEvidence,
        networkEvidenceHash: matchingCommitment.networkEvidenceHash,
        onChainAssignmentId: datum.CommittedAssignmentId,
        privateStatus: matchingCommitment.privateStatus,
        networkStatus: matchingCommitment.networkStatus,
        status: matchingCommitment.status,
      });
    }
  }

  return combined;
}

// TODO: Extract this component from here and Task Commitment
export function ReadEvidenceContent({ content }: { content: Content }) {
  const editor = useEditor({
    extensions: [...ExtensionKit()],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full text-foreground prose-headings:text-foreground",
      },
    },
  });

  return <>{editor && <EditorContent editor={editor} />}</>;
}
