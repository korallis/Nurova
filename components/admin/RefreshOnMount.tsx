'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Re-renders the current route once, e.g. after a page marked a message read
 * while rendering, so the menu's unread badge catches up.
 */
export function RefreshOnMount({ when }: { when: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (when) router.refresh();
  }, [when, router]);
  return null;
}
