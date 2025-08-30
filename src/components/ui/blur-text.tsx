'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function BlurText({ text, className = '', delay = 0 }: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const words = text.split(' ');

  return (
    <div className={`${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ 
            filter: 'blur(10px)', 
            opacity: 0,
            y: 20
          }}
          animate={isVisible ? { 
            filter: 'blur(0px)', 
            opacity: 1,
            y: 0
          } : {}}
          transition={{
            duration: 0.8,
            delay: index * 0.1 + delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block mr-2 gradient-text"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
