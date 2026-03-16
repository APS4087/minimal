'use client';

import LenisLib from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useScrollStore } from '@/stores';
import { shallow } from 'zustand/shallow';
import { Lenis } from './Lenis';

const lenisConfig = {
  lerp: 0.12,
  orientation: undefined as undefined,
  gestureOrientation: undefined as undefined,
  wheelMultiplier: 1,
  normalizeWheel: false,
  smoothTouch: false,
};

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

export function LenisWrapper() {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');
  const { lenis, setLenis } = useScrollStore(
    (s) => ({ lenis: s.lenis, setLenis: s.setLenis }),
    shallow,
  );

  useEffect(() => {
    if (isStudio) {
      // Destroy so Lenis stops intercepting wheel events inside the Studio
      if (lenis) {
        lenis.destroy();
        setLenis(undefined);
      }
    } else {
      // Recreate if destroyed (e.g. navigated back from Studio)
      if (!lenis && canHover()) {
        setLenis(new LenisLib(lenisConfig));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudio]);

  if (isStudio) return null;
  return <Lenis />;
}
