"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoldDisplayProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function GoldDisplay({
  amount,
  size = "md",
  animated = true,
  className,
}: GoldDisplayProps) {
  const [displayAmount, setDisplayAmount] = useState(animated ? 0 : amount);
  const count = useMotionValue(animated ? 0 : amount);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (animated) {
      const controls = animate(count, amount, { duration: 1, ease: "easeOut" });
      return controls.stop;
    } else {
      count.set(amount);
    }
  }, [amount, animated, count]);

  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-1.5",
    lg: "text-2xl gap-2 font-black",
  };

  const iconSizes = {
    sm: "w-4 h-4 text-base",
    md: "w-5 h-5 text-lg",
    lg: "w-8 h-8 text-2xl",
  };

  return (
    <div className={cn("flex items-center font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]", sizeClasses[size], className)}>
      <span className={cn("flex items-center justify-center leading-none", iconSizes[size])}>
        🪙
      </span>
      {animated ? (
        <motion.span>{rounded}</motion.span>
      ) : (
        <span>{amount.toLocaleString()}</span>
      )}
    </div>
  );
}
