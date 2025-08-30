'use client';

import { motion } from 'framer-motion';
import { Activity, Brain, Zap } from 'lucide-react';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  stage?: string;
  progress?: number;
}

export default function ProcessingIndicator({ 
  isProcessing, 
  stage = 'Initializing...', 
  progress = 0 
}: ProcessingIndicatorProps) {
  if (!isProcessing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="glass-card p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Heartbeat Animation */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1, 1.1, 1],
                opacity: [0.7, 1, 0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-500/30 to-red-500/30 flex items-center justify-center"
            >
              <Activity className="w-10 h-10 text-red-400" />
            </motion.div>
            
            {/* Pulse rings */}
            {[0, 0.5, 1].map((delay) => (
              <motion.div
                key={delay}
                className="absolute inset-0 rounded-full border-2 border-red-400/30"
                animate={{
                  scale: [1, 2, 2.5],
                  opacity: [0.8, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Processing Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">AI Model Processing</h3>
            <p className="text-gray-300">{stage}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Processing Steps */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                progress > 20 ? 'bg-blue-500/30 text-blue-400' : 'bg-white/10 text-gray-400'
              }`}>
                <Brain className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400">Encoding</p>
            </div>
            
            <div className="space-y-2">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                progress > 60 ? 'bg-purple-500/30 text-purple-400' : 'bg-white/10 text-gray-400'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400">Processing</p>
            </div>
            
            <div className="space-y-2">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                progress > 90 ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400">Generating</p>
            </div>
          </div>

          {/* Fun fact */}
          <div className="text-xs text-gray-500 italic">
            Dual-decoder transformer analyzing medical context...
          </div>
        </div>
      </div>
    </motion.div>
  );
}
