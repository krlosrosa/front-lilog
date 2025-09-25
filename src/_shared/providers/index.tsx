'use client'
import { ToastContainer } from "react-toastify";
import { Providers as QueryProvider } from "./queryProvider";
import { Providers as SessionProvider } from "./sessionProvider";
import { Providers as ThemeProvider } from "./themeProvider";
import { AuthSync } from "../components/AuthSync";
import { AbilityProvider } from "./abilityProvider";
import { ProviderSidebar } from "./sideBarProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <AuthSync />
        <ThemeProvider>
          <AbilityProvider>
            <ProviderSidebar>
              {children}
            </ProviderSidebar>
          </AbilityProvider>
          <ToastContainer />
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
