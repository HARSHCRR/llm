'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Brain, Home, Cpu, Users, Shield, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onSafetyClick: () => void;
}

export default function Navbar({ onSafetyClick }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 p-4"
    >
      <div className="glass-card px-6 py-3 mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">HackLLM</h1>
              <p className="text-xs text-gray-400">Medical Summarizer</p>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="glass-button px-4 py-2 text-white hover:text-blue-400">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-card border-white/20">
                  <div className="p-4 w-64">
                    <h3 className="font-semibold text-white mb-2">Medical AI Platform</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Advanced dual-decoder transformer for medical text summarization
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Patient-friendly summaries
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Clinician-focused analysis
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Provenance tracking
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="glass-button px-4 py-2 text-white hover:text-green-400">
                  <Cpu className="w-4 h-4 mr-2" />
                  Model
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-card border-white/20">
                  <div className="p-4 w-64">
                    <h3 className="font-semibold text-white mb-2">AI Architecture</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Parameters:</span>
                        <span className="text-blue-400">2.1B</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Layers:</span>
                        <span className="text-green-400">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Hidden Size:</span>
                        <span className="text-purple-400">768</span>
                      </div>
                      <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
                        Dual-decoder transformer with cross-attention mechanism
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="glass-button px-4 py-2 text-white hover:text-purple-400">
                  <Users className="w-4 h-4 mr-2" />
                  Team
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-card border-white/20">
                  <div className="p-4 w-64">
                    <h3 className="font-semibold text-white mb-2">ESYA'25 Team</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Built for HackLLM at ESYA'25 - "Techmorphosis"
                    </p>
                    <div className="text-xs text-gray-400">
                      <p>🏆 Innovation in Medical AI</p>
                      <p>🚀 Real-time browser inference</p>
                      <p>🎨 Glassmorphic design system</p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onSafetyClick}
              variant="ghost"
              size="sm"
              className="glass-button p-2 text-yellow-400 hover:text-yellow-300"
            >
              <Shield className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="glass-button p-2 text-gray-400 hover:text-white"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
