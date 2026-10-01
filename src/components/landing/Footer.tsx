import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-default bg-canvas text-xs text-content-muted">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} Михаил Соболев. Веб-разработка под задачу: от макета до запуска.
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://t.me/whhwheqkkwk"
            target="_blank"
            rel="noreferrer"
            className="hover:text-content-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus rounded px-1"
          >
            Telegram
          </a>
          <a
            href="mailto:ob0lev@yandex.ru"
            className="hover:text-content-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus rounded px-1"
          >
            Email
          </a>
          <a
            href="https://github.com/torch817"
            target="_blank"
            rel="noreferrer"
            className="hover:text-content-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus rounded px-1"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
