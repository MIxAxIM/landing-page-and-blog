import DiscordIcon from "~/components/icons/discord";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import Link from "next/link";

export default function PageSignin({ redirectUrl }: { redirectUrl?: string }) {
  const [tnc, setTnc] = useState(false);

  // todo: hardcode providers for now, because on vercel, it's not working
  const _providers = [
    {
      id: "discord",
      name: "Discord",
      type: "oauth",
    },
  ];

  return (
    <section className="bg-[url('/images/site/books-g771e712af_1280.jpg')] bg-cover">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <div className="mb-6 flex items-center text-4xl font-semibold text-primary-foreground drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
          Andamio Platform
        </div>
        <div className="w-full rounded-lg bg-background text-foreground shadow sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
              Connect to start
              <br />
              Learning and Contributing
            </h1>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center space-x-2 py-4">
                <Checkbox onCheckedChange={(checked) => setTnc(checked ? true : false)} id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept <Link href="/terms">terms and conditions</Link>
                </label>
              </div>
              {Object.values(_providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    disabled={!tnc}
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: redirectUrl,
                      })
                    }
                    className={`flex items-center rounded-lg border border-accent-foreground px-6 py-2 text-sm font-medium text-primary-foreground shadow-md ${tnc ? 'hover:bg-accent hover:text-accent-foreground bg-primary' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      }`}
                  >
                    {provider.id === "discord" && <DiscordIcon />}
                    <span>Sign in with {provider.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
