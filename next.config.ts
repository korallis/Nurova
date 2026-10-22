import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Images uploaded from the dashboard (Vercel Blob).
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      // Pre-launch: the home page shows the coming-soon page. At launch, add the
      // home page (app/(site)/page.tsx) and replace this with
      // { source: '/coming-soon', destination: '/', permanent: false }.
      { source: '/', destination: '/coming-soon', permanent: false },
    ];
  },
};

export default nextConfig;
