import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Luciel from "./pages/Luciel.tsx";
import DesignPartners from "./pages/DesignPartners.tsx";
import About from "./pages/About.tsx";
import Changelog from "./pages/Changelog.tsx";
import Contact from "./pages/Contact.tsx";
import Pricing from "./pages/Pricing.tsx";
import Checkout from "./pages/Checkout.tsx";
import Careers from "./pages/Careers.tsx";
import CareersApply from "./pages/CareersApply.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/luciel" element={<Luciel />} />
            <Route path="/design-partners" element={<DesignPartners />} />
            <Route path="/about" element={<About />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/apply" element={<CareersApply />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
