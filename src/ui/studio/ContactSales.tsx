import MenuBar from "../landing/MenuBar";

export default function PageStudio() {
  return (
    <>
      <MenuBar />
      <div className="mx-auto mt-32 min-h-[50vh] max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            Whether you&apos;re an individual, a team, or an organization, are you
            seeking to effectively guide and onboard contributors to your
            projects?
          </h2>
          <p className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
            Contact Sales
          </p>
          <p className="mx-auto mt-6 w-full text-lg leading-8 text-gray-600 md:w-3/4">
            Start your journey as a creator and empower your projects with
            Andamio&apos;s collaborative platform. Streamline your workflow, foster
            collaboration, and bring your ideas to life with ease.
          </p>
          <div className="mt-8">
            <p className="text-lg text-gray-700">
              Ready to enhance your project experience? Reach out to us
              directly:
            </p>
            <a
              href="mailto:sales@andamio.io"
              className="mt-2 block text-lg font-semibold text-primary underline"
            >
              sales@andamio.io
            </a>
            <p className="mt-4 text-lg text-gray-700">
              Or connect with any member of the Andamio team to learn more.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
