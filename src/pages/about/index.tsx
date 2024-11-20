import { Card } from "~/components/ui/card";
import MenuBar from "~/ui/landing/MenuBar";

export default function AboutPage() {
  return (
    <main
      className="items-center justify-center"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      <MenuBar />

      <div className="card z-10 mx-auto mt-24 max-w-5xl p-5 font-mono shadow-xl">
        <h1>Welcome to Andamio!</h1>
        <p className="py-3 font-medium">
          Andamio is a new kind of platform for learning and contribution
          management. It is built to enable people to onboard and contribute to
          collaborative projects so that they can make a meaningful impact. We
          envision a future where work is defined and delivered in ways that
          achieve the highest levels of human collaboration.
        </p>
        <p className="py-3 font-medium">
          Andamio consists of a learning-management platform and a
          contribution-management platform that work together to create unique
          pathways for organizations and contributors to align on meaningful
          work. It uses the Cardano blockchain to provide non-custodial ways for
          people to build a record of learning and contribution, and it allows
          organizations to collaborate in solving important problems.
        </p>
        <p className="py-3 font-medium">
          After prototyping and testing Andamio in 2023, we are now building
          Andamio for production deployment. Stay tuned for updates as Andamio
          continues to roll out.
        </p>

        <Card className="my-8">
          <h3>Andamio Whitepaper</h3>
          <div className="">
            <section className="realtive">
              <iframe
                src="https://v2-embednotion.com/c39ff303c99841079a02e43dddc6815f"
                width="100%"
                height="800px"
              ></iframe>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
