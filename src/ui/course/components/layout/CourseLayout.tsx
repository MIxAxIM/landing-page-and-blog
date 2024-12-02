import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import AppButtons from "~/components/layout/AppButtons";
import SideMenu from "~/components/navigation/SideMenu";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DesktopOnlyLayout>
      <SideMenu />
      <main className="py-10 lg:pl-72">
        <div className="">{children}</div>
        <AppButtons />
      </main>
    </DesktopOnlyLayout>
  );
}
