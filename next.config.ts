import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {ignoreDuringBuilds: true},
	typescript: {ignoreBuildErrors: true},
	images: {
		deviceSizes: [640, 960, 1200, 1920, 2400],
		imageSizes: [48, 96, 160, 320, 640, 800],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 31536000,
		loader: 'default',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.scdn.co',
				pathname: '/image/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
				pathname: '/images/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
				pathname: '/files/**',
			},
		],
	},
	reactStrictMode: true,
};

export default nextConfig;
