import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Disable the Next.js dev overlay indicator logo in the bottom-left corner
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;

