import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Luciel from "./pages/Luciel.tsx";
import Doctrine from "./pages/Doctrine.tsx";
import Security from "./pages/Security.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ContactModalProvider } from "@/components/ContactModal";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <ContactModalProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/luciel" element={<Luciel />} />
            <Route path="/doctrine" element={<Doctrine />} />
            <Route path="/security" element={<Security />} />
            <Route path="/about" element={<About />} />
            {/* Legacy redirects */}
            <Route path="/contact" element={<Navigate to="/" replace />} />
            <Route path="/how-it-works" element={<Navigate to="/luciel#how-it-works" replace />} />
            <Route path="/pricing" element={<Navigate to="/" replace />} />
            <Route path="/checkout" element={<Navigate to="/" replace />} />
            <Route path="/careers" element={<Navigate to="/about" replace />} />
            <Route path="/careers/apply" element={<Navigate to="/about" replace />} />
            <Route path="/design-partners" element={<Navigate to="/" replace />} />
            <Route path="/changelog" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ContactModalProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
