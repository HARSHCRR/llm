# Medical Summarizer - HackLLM ESYA'25 🏥✨

An advanced medical document summarization web application built for HackLLM at ESYA'25, featuring dual-mode summarization frontend with modern glassmorphism UI. Ready for backend AI integration.

## 🌟 Features

### 🔬 Dual Summarization System
- **Patient-Friendly Summaries**: Easy-to-understand explanations for patients and families
- **Clinician-Focused Summaries**: Technical, detailed summaries for healthcare professionals
- **Provenance Tracking**: Source citations and reference tracking for medical accuracy

### 🧠 AI Integration Ready
- **Backend Integration**: Ready to connect with your custom AI models
- **Mock Service**: Demonstration layer for frontend functionality
- **Extensible Architecture**: Easy to integrate with any AI backend

### 🎨 ESYA'25 "Techmorphosis" Design
- **Glassmorphism UI**: Modern frosted glass aesthetic with depth and transparency
- **3D Iridescence Background**: Dynamic OGL shader-based visual effects
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Medical Animations**: Heartbeat-style loading indicators and smooth transitions

### 🔒 Privacy & Safety
- **Client-Side Processing**: No data leaves your device
- **Medical Disclaimers**: Clear safety warnings for medical content
- **Secure Architecture**: Privacy-first design principles

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **UI Components**: shadcn/ui, Custom glassmorphism components
- **3D Graphics**: OGL, Three.js for background effects
- **Animations**: Framer Motion, CSS3 transforms
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HARSHCRR/llm.git
   cd llm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Input Medical Text**: Paste or type medical documents, reports, or notes
2. **Select Summary Type**: Choose between patient-friendly or clinician-focused
3. **Process**: Watch the custom transformer model analyze the content
4. **Review Results**: Get dual summaries with source provenance
5. **Visualize**: Explore attention heatmaps to understand model decisions

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/
│   ├── medical/           # Medical-specific components
│   └── ui/                # Reusable UI components
├── data/                  # Mock data and services
├── lib/                   # Utility functions
└── styles/                # Custom CSS and themes
```

## 🔌 Backend Integration

The frontend is designed to easily integrate with your custom AI models:

- **Mock Service**: Demonstrates expected API structure
- **Flexible Architecture**: Easy to swap mock service with real AI backend
- **Type Safety**: Full TypeScript interfaces for data structures
- **Error Handling**: Robust error states and loading indicators

## 🎨 Design Philosophy

Inspired by ESYA'25's "Techmorphosis" theme:
- **Glassmorphism**: Frosted glass effects with subtle transparency
- **Medical Aesthetics**: Heartbeat animations and medical color schemes
- **3D Depth**: Layered UI with realistic depth perception
- **Accessibility**: WCAG compliant with screen reader support

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Medical Disclaimer

This application is for educational and research purposes only. It is not intended to provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 HackLLM ESYA'25

Built with ❤️ for HackLLM at ESYA'25 - showcasing the future of medical AI and user experience design.

---

**Made with 🧠 AI and ✨ creativity for ESYA'25 Techmorphosis**
