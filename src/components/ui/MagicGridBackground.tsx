import React from 'react';

export const MagicGridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Subtle Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.22]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #71717a 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      {/* Ambient Gradient Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-zinc-400/10 dark:from-zinc-700/15 via-zinc-500/5 to-transparent blur-[120px] rounded-full" />
      <div className="absolute top-1/3 -left-40 w-[400px] h-[300px] bg-zinc-400/5 dark:bg-zinc-800/10 blur-[100px] rounded-full" />
    </div>
  );
};
