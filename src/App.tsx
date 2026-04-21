import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom"; 
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";

// Pages
import Index from "./pages/Index";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
// 🚀 NEW: Import the Verify Email page
import VerifyEmail from "./pages/VerifyEmail";

// Auth Guard
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Routes>
          {/* 🔓 Public Landing/Login Page */}
          <Route path="/" element={<Index />} />

          {/* 🚀 NEW: The Magic Link Verification Route (Must be public!) */}
          <Route path="/verify/:token" element={<VerifyEmail />} />

          {/* 🔐 Protected Routes: Only accessible with a valid JWT */}
          <Route element={<ProtectedRoute />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          {/* ❓ 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;