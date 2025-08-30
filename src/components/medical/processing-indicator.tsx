'use client';

import { motion } from 'framer-motion';
import { Activity, Heart } from 'lucide-react';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  stage: string;
  progress: number;
}

export default function ProcessingIndicator({ 
  isProcessing, 
  stage, 
  progress 
}: ProcessingIndicatorProps) {
  if (!isProcessing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-6 py-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="w-5 h-5 text-blue-400" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{stage}</span>
              <span className="text-xs text-gray-400">{progress}%</span>
            </div>
            
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-red-400" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
