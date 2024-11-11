import AppPageComponent from "~/ui/app/AppPageComponent";
import MenuBar from "~/ui/landing/MenuBar";
import { VideoBackground } from "~/ui/landing/SB7PageLanding";

export default function AndamioAppPage() {
  return (
    <>
      <VideoBackground>
        <MenuBar />
        <AppPageComponent />
      </VideoBackground>
    </>
  )
}


