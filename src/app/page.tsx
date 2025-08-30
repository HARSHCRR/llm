'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Iridescence from '@/components/ui/iridescence';
import BlurText from '@/components/ui/blur-text';
import Navbar from '@/components/ui/navbar';
import MedicalQAInput from '@/components/medical/medical-qa-input';
import DualSummaryOutput from '@/components/medical/dual-summary-output';
import ProvenanceTracker from '@/components/medical/provenance-tracker';
import ModelArchViewer from '@/components/model/model-arch-viewer';
import ProcessingIndicator from '@/components/model/processing-indicator';
import SafetyDisclaimer from '@/components/ui/safety-disclaimer';
import { MockMedicalService, SummaryData, sampleMedicalTexts } from '@/data/mock-service';
import { Button } from '@/components/ui/button';
import { FileText, Brain, Target, Shield } from 'lucide-react';

export default function Home() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedProvenance, setSelectedProvenance] = useState<string | null>(null);
  const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(false);
  const [activeSection, setActiveSection] = useState<'input' | 'output' | 'provenance' | 'model'>('input');

  const handleTextSubmit = async (text: string) => {
    setIsProcessing(true);
    setProcessingStage('Initializing...');
    setProcessingProgress(0);
    setSummaryData(null);
    setActiveSection('output');

    try {
      // Simulate progress updates
      const progressSteps = [
        { stage: 'Preprocessing medical text...', progress: 20 },
        { stage: 'Running AI analysis...', progress: 50 },
        { stage: 'Generating patient summary...', progress: 75 },
        { stage: 'Generating clinician summary...', progress: 90 },
        { stage: 'Finalizing results...', progress: 100 }
      ];

      for (const step of progressSteps) {
        setProcessingStage(step.stage);
        setProcessingProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      const result = await MockMedicalService.generateSummaries(text);
      setSummaryData(result);
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
      setProcessingProgress(0);
    }
  };

  const handleProvenanceSelect = (id: string) => {
    setSelectedProvenance(selectedProvenance === id ? null : id);
  };

  const scrollToSection = (section: 'input' | 'output' | 'provenance' | 'model') => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-x-hidden">
      {/* Iridescence Background */}
      <Iridescence />
      
      {/* Navigation */}
      <Navbar onSafetyClick={() => setShowSafetyDisclaimer(true)} />
      
      {/* Processing Indicator */}
      <ProcessingIndicator 
        isProcessing={isProcessing}
        stage={processingStage}
        progress={processingProgress}
      />

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <BlurText 
              text="HackLLM Medical Summarizer"
              className="text-5xl md:text-7xl font-bold mb-6"
            />
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Dual-decoder transformer for patient-friendly & clinician-focused medical summaries
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-sm">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-sm">Provenance Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">ESYA'25 Edition</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Quick Navigation */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: 'input', label: 'Input', icon: FileText },
                { id: 'output', label: 'Summaries', icon: Brain },
                { id: 'provenance', label: 'Provenance', icon: Target },
                { id: 'model', label: 'Model Arch', icon: Brain }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  onClick={() => scrollToSection(id as any)}
                  className={`glass-button px-6 py-3 flex items-center gap-2 ${
                    activeSection === id ? 'bg-white/20' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Texts */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-300">
              Try these sample medical cases:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleMedicalTexts.map((sample, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTextSubmit(sample.text)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing}
                >
                  <h4 className="font-semibold text-white mb-2">{sample.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {sample.text.substring(0, 120)}...
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section id="input" className="mb-16">
          <MedicalQAInput 
            onSubmit={handleTextSubmit}
            isProcessing={isProcessing}
          />
        </section>

        {/* Output Section */}
        <section id="output" className="mb-16">
          <DualSummaryOutput 
            summaryData={summaryData}
            isLoading={isProcessing}
          />
        </section>

        {/* Provenance Section */}
        <section id="provenance" className="mb-16">
          <ProvenanceTracker 
            provenanceData={summaryData?.provenance || []}
            selectedProvenance={selectedProvenance}
            onProvenanceSelect={handleProvenanceSelect}
          />
        </section>

        {/* Model Architecture Section */}
        <section id="model" className="mb-16">
          <ModelArchViewer 
            isProcessing={isProcessing}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">HackLLM Medical Summarizer</h3>
              <p className="text-sm text-gray-400">
                Built for ESYA'25 - Showcasing the future of AI in healthcare with 
                dual-decoder transformer architecture.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Patient-friendly summaries</li>
                <li>• Clinician-focused analysis</li>
                <li>• Real-time provenance tracking</li>
                <li>• Interactive model visualization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Safety</h4>
              <p className="text-sm text-gray-400 mb-4">
                This is a research prototype for educational purposes only.
              </p>
              <Button
                onClick={() => setShowSafetyDisclaimer(true)}
                className="glass-button px-4 py-2 text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                View Disclaimer
              </Button>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 ESYA'25 HackLLM Team • Medical AI Research Prototype
            </p>
          </div>
        </div>
      </footer>

      {/* Safety Disclaimer Modal */}
      <SafetyDisclaimer 
        isOpen={showSafetyDisclaimer}
        onClose={() => setShowSafetyDisclaimer(false)}
      />
    </div>
  );
}
