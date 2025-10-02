import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SecurityHeader from "@/components/SecurityHeader";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HymnSearch from "./pages/HymnSearch";
import HymnView from "./pages/HymnView";
import Events from "./pages/Events";
import Give from "./pages/Give";
import Birthdays from "./pages/Birthdays";
import WeddingAnniversaries from "./pages/WeddingAnniversaries";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityHeader />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hymn-search" element={<HymnSearch />} />
          <Route path="/hymn/:number" element={<HymnView />} />
          <Route path="/events" element={<Events />} />
          <Route path="/give" element={<Give />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/wedding-anniversaries" element={<WeddingAnniversaries />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
