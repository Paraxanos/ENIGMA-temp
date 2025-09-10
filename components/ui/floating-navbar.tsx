"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion"; // ✅ Fixed import — "motion/react" is incorrect
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current !== "number") return;

    const direction = current - (scrollYProgress.getPrevious() || 0);

    if (scrollYProgress.get() < 0.05) {
      setVisible(false);
    } else {
      if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          // ✅ Removed asymmetric padding — now symmetric for true centering
          "flex max-w-fit fixed top-5 inset-x-0 mx-auto px-6 py-3 items-center justify-center space-x-6",
          // ✅ Fully dark-themed with subtle border and shadow
          "rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800/50",
          "shadow-lg shadow-black/20",
          "text-white z-[5000]",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-2 text-sm font-medium transition-colors duration-200",
              "hover:text-neutral-300 text-neutral-400"
            )}
          >
            {navItem.icon && (
              <span className="block sm:hidden">{navItem.icon}</span>
            )}
            <span className="hidden sm:block">{navItem.name}</span>
          </a>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};