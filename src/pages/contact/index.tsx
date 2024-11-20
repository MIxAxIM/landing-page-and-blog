import Link from "next/link";
import Footer from "~/ui/landing/Footer";
import MenuBar from "~/ui/landing/MenuBar";

export default function AboutPage() {
  return (
    <>
      <main
        className="items-center justify-center"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        <MenuBar />

        <div className="card z-10 mx-auto mt-24 max-w-5xl p-5 shadow-xl">
          <h1>Get In Touch</h1>
          <p className="py-3 font-medium">
            Email: <Link href="mailto:hello@andamio.io">hello@andamio.io</Link>
          </p>
          <p className="py-3 font-medium">
            X:{" "}
            <Link href="https://twitter.com/AndamioPlatform">
              @AndamioPlatform
            </Link>
          </p>
          <p className="py-3 font-medium">
            Andamio Public Discord: Coming Q3 2024
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
