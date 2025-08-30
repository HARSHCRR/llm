'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassCard from '@/components/ui/glass-card';
import { Brain, Layers, ArrowRight, Eye, Zap } from 'lucide-react';

interface ModelArchViewerProps {
  isProcessing?: boolean;
  attentionWeights?: number[][];
}

export default function ModelArchViewer({ isProcessing = false, attentionWeights }: ModelArchViewerProps) {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const layers = [
    { name: 'Input Embedding', type: 'embedding', active: isProcessing },
    { name: 'Encoder Layer 1', type: 'encoder', active: isProcessing },
    { name: 'Encoder Layer 2', type: 'encoder', active: isProcessing },
    { name: 'Patient Decoder', type: 'decoder-patient', active: isProcessing },
    { name: 'Clinician Decoder', type: 'decoder-clinician', active: isProcessing },
    { name: 'Cross Attention', type: 'attention', active: isProcessing },
    { name: 'Output Generation', type: 'output', active: isProcessing }
  ];

  const getLayerColor = (type: string) => {
    switch (type) {
      case 'embedding': return 'from-blue-500/30 to-cyan-500/30';
      case 'encoder': return 'from-green-500/30 to-emerald-500/30';
      case 'decoder-patient': return 'from-pink-500/30 to-rose-500/30';
      case 'decoder-clinician': return 'from-purple-500/30 to-indigo-500/30';
      case 'attention': return 'from-yellow-500/30 to-orange-500/30';
      case 'output': return 'from-red-500/30 to-pink-500/30';
      default: return 'from-gray-500/30 to-gray-600/30';
    }
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'embedding': return <Layers className="w-4 h-4" />;
      case 'encoder': return <Brain className="w-4 h-4" />;
      case 'decoder-patient': return <Eye className="w-4 h-4" />;
      case 'decoder-clinician': return <Eye className="w-4 h-4" />;
      case 'attention': return <Zap className="w-4 h-4" />;
      case 'output': return <ArrowRight className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <GlassCard className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20">
            <Brain className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Dual-Decoder Transformer Architecture</h3>
          {isProcessing && (
            <div className="ml-auto">
              <div className="processing-indicator text-sm text-green-400">Live Processing</div>
            </div>
          )}
        </div>

        {/* Architecture Diagram */}
        <div className="relative">
          <svg viewBox="0 0 800 600" className="w-full h-80 overflow-visible">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Layer Nodes */}
            {layers.map((layer, index) => {
              const x = 100 + (index % 3) * 200;
              const y = 100 + Math.floor(index / 3) * 120;
              
              return (
                <g key={index}>
                  {/* Connection Lines */}
                  {index > 0 && (
                    <motion.line
                      x1={100 + ((index - 1) % 3) * 200}
                      y1={100 + Math.floor((index - 1) / 3) * 120}
                      x2={x}
                      y2={y}
                      className="connection-line"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: layer.active ? 1 : 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}
                  
                  {/* Layer Node */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="30"
                    className={`model-node cursor-pointer ${layer.active ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => setSelectedLayer(index)}
                    animate={{
                      scale: layer.active ? [1, 1.1, 1] : 1,
                      opacity: layer.active ? [0.8, 1, 0.8] : 0.5
                    }}
                    transition={{
                      duration: 2,
                      repeat: layer.active ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Layer Label */}
                  <text
                    x={x}
                    y={y + 50}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium"
                  >
                    {layer.name}
                  </text>
                </g>
              );
            })}

            {/* Dual Output Branches */}
            <motion.path
              d="M 500 220 Q 550 200 600 180"
              fill="none"
              stroke="rgba(245, 87, 108, 0.6)"
              strokeWidth="3"
              className="connection-line"
            />
            <motion.path
              d="M 500 220 Q 550 240 600 260"
              fill="none"
              stroke="rgba(79, 172, 254, 0.6)"
              strokeWidth="3"
              className="connection-line"
            />
            
            <text x="620" y="185" className="text-xs fill-pink-400 font-medium">Patient Output</text>
            <text x="620" y="265" className="text-xs fill-blue-400 font-medium">Clinician Output</text>
          </svg>
        </div>

        {/* Layer Details */}
        {selectedLayer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full bg-gradient-to-r ${getLayerColor(layers[selectedLayer].type)}`}>
                {getLayerIcon(layers[selectedLayer].type)}
              </div>
              <h4 className="text-lg font-bold text-white">{layers[selectedLayer].name}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-2">
                  {layers[selectedLayer].type === 'embedding' && "Converts input tokens to high-dimensional vectors"}
                  {layers[selectedLayer].type === 'encoder' && "Processes contextual relationships in medical text"}
                  {layers[selectedLayer].type === 'decoder-patient' && "Generates patient-friendly summaries"}
                  {layers[selectedLayer].type === 'decoder-clinician' && "Generates clinician-focused summaries"}
                  {layers[selectedLayer].type === 'attention' && "Cross-attention mechanism between decoders"}
                  {layers[selectedLayer].type === 'output' && "Final text generation and formatting"}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Parameters:</span>
                  <span className="text-white">{Math.floor(Math.random() * 1000)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Activation:</span>
                  <span className="text-white">{layers[selectedLayer].active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Attention Heatmap */}
        {attentionWeights && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-400" />
              Attention Heatmap
            </h4>
            <div className="attention-heatmap p-4 rounded-lg">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-sm"
                    style={{
                      backgroundColor: `rgba(79, 172, 254, ${Math.random() * 0.8 + 0.2})`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Model Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">2.1B</div>
            <div className="text-xs text-gray-400">Parameters</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-400">12</div>
            <div className="text-xs text-gray-400">Layers</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">768</div>
            <div className="text-xs text-gray-400">Hidden Size</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
