import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { SpringButton } from "@/components/SpringButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"staff" | "student">("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(role === "staff" ? "/staff" : "/student");
  };

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
                aria-label="Password"
              />
            </div>
            <SpringButton type="submit" className="h-11 w-full">
              Sign In
            </SpringButton>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Demo mode — click Sign In to explore
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
