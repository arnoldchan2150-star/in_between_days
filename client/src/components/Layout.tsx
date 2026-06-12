import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  /** When true the page starts directly under the fixed navbar (no top padding) */
  fullBleed?: boolean;
}

export default function Layout({ children, fullBleed = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={["flex-1", fullBleed ? "" : "pt-16 md:pt-20"].join(" ")}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
