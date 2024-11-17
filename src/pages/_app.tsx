import "~/styles/globals.css";
import "@meshsdk/react/styles.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";
import { Toaster as UiToaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import { MeshProvider } from "@meshsdk/react";
import { DialogReportSupport } from "~/ui/site/DialogReportSupport";
import TncDialog from "~/ui/site/TncDialog";
import Metatags from "~/components/site/metatags";
import { TerminologyProvider } from "~/contexts/terminology-context";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TerminologyProvider>
        <Metatags />
        <SessionProvider session={session}>
          <MeshProvider>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-background text-foreground">
              <Component {...pageProps} />
              <UiToaster />
              <TncDialog />
            </div>
            <DialogReportSupport />
          </MeshProvider>
        </SessionProvider>
      </TerminologyProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
