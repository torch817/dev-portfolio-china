import React from 'react';

export const MagicGridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Subtle Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      {/* Ambient Gradient Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-cyan-500/15 dark:from-cyan-500/20 via-blue-500/10 to-transparent blur-[120px] rounded-full" />
      <div className="absolute top-1/3 -left-40 w-[400px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
    </div>
  );
};
