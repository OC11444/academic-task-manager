import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "strong" | "solid";
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "glass",
      strong: "glass-strong",
      solid: "bg-card border border-border",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg p-6",
          variantClasses[variant],
          className
        )}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
