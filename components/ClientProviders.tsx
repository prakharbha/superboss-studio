'use client';

import dynamic from 'next/dynamic';

// Lazy load LiveChat since it's not needed for initial render
const LiveChat = dynamic(() => import('./LiveChat'), {
  ssr: false,
  loading: () => null,
});

export default function ClientProviders() {
  return <LiveChat />;
}

