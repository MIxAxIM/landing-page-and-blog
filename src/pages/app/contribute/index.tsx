
import PublicContributionPageComponent from "~/ui/contribution/PublicContributionPageComponent";
import MenuBar from "~/ui/landing/MenuBar";
import { VideoBackground } from "~/ui/landing/SB7PageLanding";

export default function PublicContributePage() {


  return (
    <>
      <VideoBackground>
        <MenuBar />
        <PublicContributionPageComponent />
      </VideoBackground>
    </>
  );
}
