import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function ShelfScene({ children }: Props) {
  return (
    <div className="relative mt-4 w-full">
      {/* Shelf shadow on wall */}
      <div
        className="absolute -bottom-1 left-[2%] right-[2%] h-6 rounded-[50%] opacity-50 blur-md"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, transparent 70%)' }}
      />

      {/* Shelf board */}
      <div
        className="relative rounded-sm border border-[#2a1f18] px-3 pb-4 pt-5 sm:px-5"
        style={{
          background: `
            linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 12%),
            linear-gradient(92deg, #3d2e22 0%, #5c4330 22%, #4a3628 50%, #3a2a20 78%, #2a1f18 100%)
          `,
          boxShadow: `
            inset 0 2px 0 rgba(255, 230, 200, 0.12),
            inset 0 -6px 14px rgba(0,0,0,0.45),
            0 14px 28px rgba(0,0,0,0.35),
            0 4px 0 #1a1410
          `,
        }}
      >
        {/* Brass lip highlight */}
        <div
          className="pointer-events-none absolute left-3 right-3 top-3 h-px opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 95, 0.9), transparent)',
          }}
        />
        <p className="mb-1 text-center font-serif text-[0.65rem] uppercase tracking-[0.35em] text-[#c4a574]/90">
          Collected volumes
        </p>
        {children}
      </div>
    </div>
  );
}
