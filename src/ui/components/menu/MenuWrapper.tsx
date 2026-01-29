'use client';

import { usePathname } from 'next/navigation';
import { Menu } from './Menu';

export function MenuWrapper() {
  const pathname = usePathname();

  // Hide menu on studio pages
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return <Menu />;
}
