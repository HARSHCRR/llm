'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { Send, FileText, Stethoscope } from 'lucide-react';

interface MedicalQAInputProps {
  onSubmit: (text: string) => void;
  isProcessing?: boolean;
}

export default function MedicalQAInput({ onSubmit, isProcessing = false }: MedicalQAInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim() && !isProcessing) {
      onSubmit(inputText.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const sampleTexts = [
    "Patient presents with chest pain, shortness of breath, and elevated troponin levels...",
    "45-year-old male with diabetes mellitus type 2, hypertension, and recent onset of fatigue...",
    "Post-operative complications following appendectomy include wound infection and delayed healing..."
  ];

  return (
    <GlassCard className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <Stethoscope className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Medical Text Input</h2>
        </div>

        <div className="relative">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter medical text, case study, or clinical notes for dual summarization..."
            className="glass-input min-h-[200px] text-white placeholder-gray-300 resize-none"
            disabled={isProcessing}
          />
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="processing-indicator">
                <div className="text-white font-medium">Processing...</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-300">Quick samples:</span>
          {sampleTexts.map((sample, index) => (
            <motion.button
              key={index}
              onClick={() => setInputText(sample)}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
            >
              Sample {index + 1}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{inputText.length} characters</span>
            <span className="text-gray-500">•</span>
            <span>Ctrl+Enter to submit</span>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!inputText.trim() || isProcessing}
            className="glass-button px-6 py-2 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isProcessing ? 'Processing...' : 'Generate Summaries'}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
