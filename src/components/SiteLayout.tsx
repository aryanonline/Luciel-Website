import { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export const SiteLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <Nav />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);
