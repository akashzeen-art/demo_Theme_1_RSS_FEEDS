import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SitePreloader } from "@/components/SitePreloader";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RefundPolicy from "./pages/RefundPolicy";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import Account from "./pages/Account";
import Reels from "./pages/Reels";
import Live from "./pages/Live";
import Sports from "./pages/Sports";
import Movies from "./pages/Movies";
import Webseries from "./pages/Webseries";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SitePreloader />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/live" element={<Live />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/webseries" element={<Webseries />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
