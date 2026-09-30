import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-950/60 text-xs text-zinc-500 dark:text-zinc-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Михаил Соболев. Веб-разработка под ключ.
        </div>
        <div className="flex items-center gap-4">
          <a href="https://t.me/whhwheqkkwk" target="_blank" rel="noreferrer" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
            Telegram
          </a>
          <a href="https://github.com/torch817" target="_blank" rel="noreferrer" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
