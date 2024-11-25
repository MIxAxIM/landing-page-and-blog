import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import AppButtons from "~/ui/app/layout/AppButtons";
import SideMenu from "~/ui/navigation/SideMenu";

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
