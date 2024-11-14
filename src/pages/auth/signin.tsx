import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import PageSignin from "~/ui/auth/PageSignin";

export default function SignIn({ }: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return <PageSignin redirectUrl="/app" />;
  // // todo: hardcode providers for now, because on vercel, it's not working
  // const _providers = [
  //   {
  //     callbackUrl: "http://localhost:3000/api/auth/callback/discord",
  //     id: "discord",
  //     name: "Discord",
  //     signinUrl: "http://localhost:3000/api/auth/signin/discord",
  //     type: "oauth",
  //   },
  // ];

  // return (
  //   <section className="bg-[url('/images/site/books-g771e712af_1280.jpg')] bg-cover">
  //     <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
  //       <div className="mb-6 flex items-center text-2xl font-semibold text-primary-foreground drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
  //         Andamio Platform
  //       </div>
  //       <div className="w-full rounded-lg bg-primary shadow dark:bg-primary sm:max-w-md md:mt-0 xl:p-0">
  //         <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8">
  //           <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-foreground dark:text-primary-foreground md:text-2xl">
  //             Connect to start
  //             <br />
  //             Learning and Contributing
  //           </h1>

  //           <div className="flex flex-col items-center gap-2">
  //             {Object.values(_providers).map((provider) => (
  //               <div key={provider.name}>
  //                 <button
  //                   onClick={() => signIn(provider.id)}
  //                   className="flex items-center rounded-lg border border-accent-foreground bg-primary px-6 py-2 text-sm font-medium text-foreground shadow-md hover:bg-gray-200"
  //                 >
  //                   {provider.id === "discord" && <DiscordIcon />}
  //                   <span>Sign in with {provider.name}</span>
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    if (context.query.callbackUrl) {
      return { redirect: { destination: "/app" } };
    }
    return { redirect: { destination: "/app" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
