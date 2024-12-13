import "~/styles/globals.css";
import "@meshsdk/react/styles.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";
import { Toaster as UiToaster } from "~/components/ui/toaster";
import { MeshProvider } from "@meshsdk/react";
import Metatags from "~/components/common/metatags";

import { ThemeProvider } from "~/contexts/theme-provider";
import { TerminologyProvider } from "~/contexts/terminology-context";
import TncDialog from "~/components/common/TncDialog";
import { DialogReportSupport } from "~/components/common/DialogReportSupport";
import UserActionDialog from "~/components/common/UserActionDialog";

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
              <UserActionDialog />
            </div>
            <DialogReportSupport />
          </MeshProvider>
        </SessionProvider>
      </TerminologyProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
