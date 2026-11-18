import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@devlab/ui', '@devlab/contracts'],
};

export default nextConfig;
