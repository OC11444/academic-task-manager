import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import React from "react";

interface SpringButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const SpringButton = React.forwardRef<HTMLButtonElement, SpringButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <Button
          ref={ref}
          {...props}
          className={props.className}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);
SpringButton.displayName = "SpringButton";
