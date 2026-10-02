import { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/landing/Header';
import { HeroSection } from './components/landing/HeroSection';
import { ProjectsSection } from './components/landing/ProjectsSection';
import { SkillsSection } from './components/landing/SkillsSection';
import { AboutSection } from './components/landing/AboutSection';
import { ContactsSection } from './components/landing/ContactsSection';
import { Footer } from './components/landing/Footer';
import { ChinaOrderDemo } from './components/demo/ChinaOrderDemo';
import { getRouteView } from './utils/router';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window !== 'undefined') {
      const currentFull = window.location.pathname + window.location.search;
      if (currentFull !== to) {
        window.history.pushState({}, '', to);
        setCurrentPath(to);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const currentView = getRouteView(currentPath);

  useEffect(() => {
    if (currentView !== 'home') {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const elements = document.querySelectorAll('.reveal-on-scroll');

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [currentView]);

  return (
    <ToastProvider>
      <div className="relative min-h-screen flex flex-col justify-between bg-canvas">
        <Header currentView={currentView} onNavigate={navigate} />

        <main className="flex-1">
          {currentView === 'home' ? (
            <>
              <HeroSection onNavigate={navigate} onOpenDemo={() => navigate('/demo')} />
              <ProjectsSection
                className="reveal-on-scroll"
                onNavigate={navigate}
                onOpenDemo={() => navigate('/demo')}
              />
              <SkillsSection className="reveal-on-scroll" />
              <AboutSection className="reveal-on-scroll" />
              <ContactsSection className="reveal-on-scroll" />
            </>
          ) : (
            <ChinaOrderDemo onNavigate={navigate} onBack={() => navigate('/')} />
          )}
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
