import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/landing/Header';
import { HeroSection } from './components/landing/HeroSection';
import { ProofSection } from './components/landing/ProofSection';
import { ProjectsSection } from './components/landing/ProjectsSection';
import { SkillsSection } from './components/landing/SkillsSection';
import { AboutSection } from './components/landing/AboutSection';
import { ContactsSection } from './components/landing/ContactsSection';
import { Footer } from './components/landing/Footer';
import { ChinaOrderDemo } from './components/demo/ChinaOrderDemo';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'demo'>('home');

  return (
    <ToastProvider>
      <div className="relative min-h-screen flex flex-col justify-between bg-canvas">
        <Header currentView={currentView} setCurrentView={setCurrentView} />

        <main className="flex-1">
          {currentView === 'home' ? (
            <>
              <HeroSection onOpenDemo={() => setCurrentView('demo')} />
              <ProofSection />
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
  );
}

export default App;
