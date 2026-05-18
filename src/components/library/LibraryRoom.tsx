import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/**
 * Simple frame around the shelf — no parallax, vignette, or layered “room haze”.
 * The Collected volumes strip (ShelfScene + scroll row) carries the UI.
 */
export function LibraryRoom({ children }: Props) {
  return (
    <div className="relative isolate w-full overflow-hidden rounded-sm border border-[#1a1410]/90 bg-[#141210] shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
      <div className="relative px-4 pb-6 pt-6 sm:px-8">{children}</div>
    </div>
  );
}
