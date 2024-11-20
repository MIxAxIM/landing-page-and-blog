import MenuBar from "~/ui/landing/MenuBar";

export default function CalendarPage() {
  return (
    <main
      className="items-center justify-center"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      <MenuBar />

      <div className="card z-10 mx-auto max-w-5xl p-5 shadow-xl md:mt-24">
        <h1>Andamio Public Calendar</h1>
        <div className="">
          <section className="relative">
            <iframe
              src="https://teamup.com/ksso1wk6ysj9ireqau?title=Gimbalabs%20Calendar&showLogo=0&showSearch=0&showProfileAndInfo=0&showSidepanel=1&disableSidepanel=1&showTitle=0&showViewSelector=1&showMenu=0&showAgendaHeader=1&showAgendaDetails=0&showYearViewHeader=1"
              width="100%"
              height="800px"
            ></iframe>
          </section>
        </div>
      </div>
    </main>
  );
}
