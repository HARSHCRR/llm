'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import { User, UserCheck, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SummaryData {
  patientSummary: string;
  clinicianSummary: string;
  provenance: Array<{
    text: string;
    source: string;
    confidence: number;
  }>;
}

interface DualSummaryOutputProps {
  summaryData: SummaryData | null;
  isLoading?: boolean;
}

export default function DualSummaryOutput({ summaryData, isLoading = false }: DualSummaryOutputProps) {
  const [copiedStates, setCopiedStates] = useState<{ patient: boolean; clinician: boolean }>({
    patient: false,
    clinician: false
  });

  const handleCopy = async (text: string, type: 'patient' | 'clinician') => {
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
        <GlassCard className="patient-theme">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Patient-Friendly Summary</h3>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="clinician-theme">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Clinician-Focused Summary</h3>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <GlassCard className="text-center py-12">
          <div className="text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <p className="text-lg">Enter medical text above to generate dual summaries</p>
            <p className="text-sm mt-2">AI will create both patient-friendly and clinician-focused versions</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.2 }}
    >
      {/* Patient-Friendly Summary */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="patient-theme h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-pink-500/20">
                  <User className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Patient-Friendly Summary</h3>
              </div>
              <button
                onClick={() => handleCopy(summaryData.patientSummary, 'patient')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {copiedStates.patient ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {summaryData.patientSummary}
              </p>
            </div>
            
            <div className="text-xs text-gray-400 border-t border-white/10 pt-3">
              <p>✨ Simplified for patient understanding</p>
              <p>🔍 Medical jargon translated to everyday language</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Clinician-Focused Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard className="clinician-theme h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <UserCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Clinician-Focused Summary</h3>
              </div>
              <button
                onClick={() => handleCopy(summaryData.clinicianSummary, 'clinician')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {copiedStates.clinician ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {summaryData.clinicianSummary}
              </p>
            </div>
            
            <div className="text-xs text-gray-400 border-t border-white/10 pt-3">
              <p>🏥 Clinical terminology preserved</p>
              <p>📊 Key metrics and actionable insights highlighted</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
