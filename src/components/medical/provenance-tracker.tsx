'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import { Quote, ExternalLink, Target } from 'lucide-react';

interface ProvenanceItem {
  id: string;
  text: string;
  source: string;
  confidence: number;
  position: { start: number; end: number };
}

interface ProvenanceTrackerProps {
  provenanceData: ProvenanceItem[];
  selectedProvenance?: string | null;
  onProvenanceSelect?: (id: string) => void;
}

export default function ProvenanceTracker({ 
  provenanceData, 
  selectedProvenance, 
  onProvenanceSelect 
}: ProvenanceTrackerProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400 bg-green-400/20';
    if (confidence >= 0.6) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (!provenanceData.length) {
    return (
      <GlassCard className="w-full max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <Quote className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400">No provenance data available</p>
          <p className="text-sm text-gray-500 mt-2">Generate summaries to see source citations</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Provenance Tracker</h3>
          <div className="text-sm text-gray-400">
            {provenanceData.length} source{provenanceData.length !== 1 ? 's' : ''} identified
          </div>
        </div>

        <div className="space-y-3">
          {provenanceData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                p-4 rounded-lg border transition-all duration-200 cursor-pointer
                ${selectedProvenance === item.id 
                  ? 'bg-white/20 border-purple-400/50 shadow-lg' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
              `}
              onClick={() => onProvenanceSelect?.(item.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">
                      Source {index + 1}
                    </span>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${getConfidenceColor(item.confidence)}
                    `}>
                      {getConfidenceLabel(item.confidence)} ({Math.round(item.confidence * 100)}%)
                    </div>
                  </div>
                  
                  <p className="text-gray-200 text-sm leading-relaxed mb-3">
                    "{item.text}"
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ExternalLink className="w-3 h-3" />
                    <span>{item.source}</span>
                    <span className="text-gray-500">•</span>
                    <span>Position: {item.position.start}-{item.position.end}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">How to use Provenance Tracker</span>
          </div>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Click on any source to highlight corresponding text in summaries</li>
            <li>• Confidence scores indicate reliability of source attribution</li>
            <li>• Position numbers show character ranges in original text</li>
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}
