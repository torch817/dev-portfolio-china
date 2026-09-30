import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/landing/Header';
import { HeroSection } from './components/landing/HeroSection';
import { ProjectsSection } from './components/landing/ProjectsSection';
import { SkillsSection } from './components/landing/SkillsSection';
import { AboutSection } from './components/landing/AboutSection';
import { ContactsSection } from './components/landing/ContactsSection';
import { Footer } from './components/landing/Footer';
import { ChinaOrderDemo } from './components/demo/ChinaOrderDemo';
import { MagicGridBackground } from './components/ui/MagicGridBackground';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'demo'>('home');

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="relative min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
          <MagicGridBackground />
          <Header currentView={currentView} setCurrentView={setCurrentView} />

          <main className="flex-1">
            {currentView === 'home' ? (
              <>
                <HeroSection onOpenDemo={() => setCurrentView('demo')} />
                <ProjectsSection onOpenDemo={() => setCurrentView('demo')} />
                <SkillsSection />
                <AboutSection />
                <ContactsSection />
              </>
            ) : (
              <ChinaOrderDemo onBack={() => setCurrentView('home')} />
            )}
          </main>

          <Footer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
