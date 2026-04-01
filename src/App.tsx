import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// 1. Changed BrowserRouter to HashRouter
import { HashRouter, Route, Routes } from "react-router-dom"; 
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* 2. Swapped BrowserRouter for HashRouter. Basename is usually not needed here! */}
      <HashRouter>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;