import MenuBar from "../../../../ui/landing/MenuBar";

export default function ReviewerDashboard() {
  return (
    <div>
      <MenuBar />

      <main className="px-10 py-24">
        <div className="flex justify-center">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Reviewer Dashboard
          </h2>
        </div>
      </main>
    </div>
  );
}
