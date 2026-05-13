import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Luciel from "./pages/Luciel.tsx";
import Platform from "./pages/Platform.tsx";
import Trust from "./pages/Trust.tsx";
import Doctrine from "./pages/Doctrine.tsx";
import About from "./pages/About.tsx";
import Privacy from "./pages/Privacy.tsx";
import Pricing from "./pages/Pricing.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Account from "./pages/Account.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import LucielInstanceDetail from "./pages/LucielInstanceDetail.tsx";
import Login from "./pages/Login.tsx";
import LegalTerms from "./pages/LegalTerms.tsx";
import LegalPrivacy from "./pages/LegalPrivacy.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ContactModalProvider } from "@/components/ContactModal";
import { WaitlistProvider } from "@/components/WaitlistModal";
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
            <WaitlistProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products/luciel" element={<Luciel />} />
                <Route path="/platform" element={<Platform />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/doctrine" element={<Doctrine />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account defaultTab="profile" />} />
                <Route path="/account/billing" element={<Account defaultTab="billing" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/luciels/:pk" element={<LucielInstanceDetail />} />
                <Route path="/legal/terms" element={<LegalTerms />} />
                <Route path="/legal/privacy" element={<LegalPrivacy />} />
                <Route path="/security" element={<Navigate to="/trust" replace />} />
                {/* Legacy redirects */}
                <Route path="/luciel" element={<Navigate to="/products/luciel" replace />} />
                <Route path="/products" element={<Navigate to="/products/luciel" replace />} />
                <Route path="/how-it-works" element={<Navigate to="/platform" replace />} />
                <Route path="/checkout" element={<Navigate to="/pricing" replace />} />
                <Route path="/careers" element={<Navigate to="/about" replace />} />
                <Route path="/careers/apply" element={<Navigate to="/about" replace />} />
                <Route path="/design-partners" element={<Navigate to="/contact" replace />} />
                <Route path="/changelog" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WaitlistProvider>
          </ContactModalProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
