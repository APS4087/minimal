'use client';

import { usePathname } from 'next/navigation';
import { Lenis } from './Lenis';

export function LenisWrapper() {
  const pathname = usePathname();

  // Disable Lenis on studio pages to allow normal scrolling
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return <Lenis />;
}
