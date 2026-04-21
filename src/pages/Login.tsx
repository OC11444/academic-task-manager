import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { SpringButton } from "@/components/SpringButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SetPassword from "./SetPassword";
import SignupSuccess from "./SignupSuccess";
import { authService } from "@/services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"staff" | "student">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login({
        email,
        password,
        role,
      });

      const { status, data } = result;

      // 1. Path for Returning Users with valid credentials
      if (data?.access) {
        navigate(data.role === "staff" ? "/staff" : "/student");
        return;
      }

      // 2. Path for successful verification initiation (201 Created)
      if (status === 201) {
        setShowSuccess(true);
        return;
      }

      setShowSuccess(true);
    } catch (error: any) {
      console.error("Login failed:", error);

      // 🚀 THE FIX: Robust New User Detection
      // We convert the backend error to a lowercase string so we can search it for clues
      const errorData = error.response?.data;
      const errorString = JSON.stringify(errorData || "").toLowerCase();

      // If Django specifically asks for confirmation or flags a first-time login,
      // we instantly route them to the SetPassword component.
      if (
        errorString.includes("first-time login") || 
        errorString.includes("confirm_password") ||
        errorString.includes("must confirm")
      ) {
        console.log("New user detected via login form! Redirecting to setup...");
        setIsNewUser(true);
        return;
      }

      // Show actual error for other issues (e.g., wrong password, missing registry email)
      const displayError = errorData?.error || errorData?.detail || "Login failed. Please check your credentials.";
      alert(displayError);
      
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <SignupSuccess email={email} />
        </motion.div>
      </div>
    );
  }

  if (isNewUser) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <SetPassword email={email} onSignup={() => setShowSuccess(true)} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <GlassCard variant="strong" className="space-y-8 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Collab Task Manager</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to manage your academic workflow
              </p>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex gap-2 rounded-lg bg-muted p-1">
            {(["student", "staff"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                disabled={isLoading}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  role === r
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={`Sign in as ${r}`}
              >
                {r === "staff" ? "Lecturer" : "Student"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="h-11"
                disabled={isLoading}
                aria-label="University email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11"
                disabled={isLoading}
                aria-label="Password"
              />
            </div>
            <SpringButton type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing your dashboard...
                </>
              ) : (
                "Sign In"
              )}
            </SpringButton>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsNewUser(true)}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              First time logging in? Create account
            </button>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
}