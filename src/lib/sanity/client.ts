import { createClient } from '@sanity/client';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
};

// Public client — safe to use in client components (no token)
export const client = createClient({
  ...config,
  useCdn: process.env.NODE_ENV === 'production',
});

// Server-only client — uses API token for authenticated reads/previews.
// Never import this in client components; SANITY_API_READ_TOKEN has no
// NEXT_PUBLIC_ prefix so it is never sent to the browser.
export const serverClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

