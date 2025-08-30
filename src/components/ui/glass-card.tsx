'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  floating?: boolean;
  pulse?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true, 
  floating = false,
  pulse = false 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "glass-card p-6",
        floating && "floating-card",
        pulse && "medical-pulse",
        hover && "hover:transform hover:scale-[1.02] hover:shadow-2xl",
        className
      )}
      whileHover={hover ? { y: -2 } : {}}
    >
      {children}
    </motion.div>
  );
}
