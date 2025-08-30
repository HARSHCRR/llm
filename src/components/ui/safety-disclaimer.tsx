'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SafetyDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyDisclaimer({ isOpen, onClose }: SafetyDisclaimerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-yellow-500/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="p-2 rounded-full bg-yellow-500/20">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            Medical AI Safety Disclaimer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-gray-200">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">Important Medical Disclaimer</h3>
                <p className="text-sm leading-relaxed">
                  This AI-powered medical summarization tool is designed for educational and research purposes only. 
                  It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">For Healthcare Professionals</h4>
                <p className="text-sm text-gray-300">
                  While this tool can assist in summarizing medical information, all clinical decisions 
                  should be based on your professional judgment and current medical guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">For Patients</h4>
                <p className="text-sm text-gray-300">
                  Patient-friendly summaries are simplified interpretations. Always consult with your 
                  healthcare provider for accurate medical information and treatment decisions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">Data Privacy</h4>
                <p className="text-sm text-gray-300">
                  This tool processes data locally in your browser. However, avoid entering personally 
                  identifiable information (PII) or sensitive patient data.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="font-semibold text-white mb-2">Emergency Situations</h4>
            <p className="text-sm text-red-300">
              In case of medical emergencies, immediately contact emergency services or your local emergency number. 
              Do not rely on AI tools for urgent medical decisions.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-2">About This Tool</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Developed for HackLLM at ESYA'25 • Dual-decoder transformer architecture • 
              Educational demonstration of AI in healthcare • Not FDA approved • 
              Research prototype only
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-gray-500">
              By using this tool, you acknowledge and accept these terms.
            </div>
            <motion.button
              onClick={onClose}
              className="glass-button px-6 py-2 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-4 h-4" />
              I Understand
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
