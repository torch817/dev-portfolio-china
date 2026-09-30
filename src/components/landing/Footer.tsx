import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Михаил Соболев. Веб-разработка под ключ.
        </div>
        <div className="flex items-center gap-4">
          <a href="https://t.me/whhwheqkkwk" target="_blank" rel="noreferrer" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
            Telegram
          </a>
          <a href="https://github.com/torch817" target="_blank" rel="noreferrer" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
