import { useState } from "react";
import MobileMenu from "./SideMenu/MobileMenu";
import DesktopMenu from "./SideMenu/DesktopMenu";
import MobileTopbar from "./SideMenu/MobileTopbar";

export default function SideMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <MobileMenu sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <DesktopMenu />
      <MobileTopbar setSidebarOpen={setSidebarOpen} />
    </>
  );
}
