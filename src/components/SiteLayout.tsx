import { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ContactModalProvider } from "./ContactModal";

export const SiteLayout = ({ children }: { children: ReactNode }) => (
  <ContactModalProvider>
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  </ContactModalProvider>
);
