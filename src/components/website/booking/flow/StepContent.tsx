
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepContentProps } from "../types";

export function StepContent({ step, children }: StepContentProps) {
  // Animation variants
  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
