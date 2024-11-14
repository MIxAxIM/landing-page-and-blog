import React, { useState } from "react";
import MenuBar from "./MenuBar";
import { LearnerHero } from "./LearnerHero";
import { OrganizationHero } from "./OrganizationHero";
import { HowAndamioWorks } from "./HowAndamioWorks";
import { RealWorldUseCases } from "./RealWorldUseCases";
import { BuiltOnCardano } from "./BuiltOnCardano";
import { JoinAndamio } from "./JoinAndamio";
import { SolutionsForContributors } from "./SolutionsForContributors";
import { FAQ } from "./FAQ";

export default function SB7PageLanding() {
  const [role, setRole] = useState<"learner" | "organization">("learner");
  return (
    <>
      <VideoBackground>
        <MenuBar role={role} setRole={setRole} />
        <div className="flex w-full flex-col">
          <div
            className="flex flex-grow"
            style={{ minHeight: `calc(100vh - 80px)` }} // Adjust 80px based on your MenuBar height
          >
            {role === "learner" ? <LearnerHero /> : <OrganizationHero />}
          </div>
        </div>
        {/* Conditionally Render Based on Role */}
        {role === "learner" ? (
          <>
            <HowAndamioWorks />
            <SolutionsForContributors />
          </>
        ) : (
          <RealWorldUseCases />
        )}
        <BuiltOnCardano />
        <JoinAndamio role={role} />
        <FAQ />
      </VideoBackground>
    </>
  );
}

export const VideoBackground = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="relative min-h-screen">
        {/* Video container */}
        <div className="fixed left-0 top-0 h-full w-full overflow-hidden opacity-70">
          <video
            className="min-h-screen min-w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/bg-video-002.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content overlay */}
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
};
