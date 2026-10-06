import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "EstateHub — Find Your Perfect Home",
	description:
		"Browse thousands of apartments, villas, houses and plots across India. Find your dream property on EstateHub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} bg-stone-50 text-slate-900 antialiased`} suppressHydrationWarning>
				<Navbar />
				<main>{children}</main>
				<footer className="mt-16 border-t border-stone-200 bg-white py-8">
					<div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
						© {new Date().getFullYear()} EstateHub · Built for real people, real homes.
					</div>
				</footer>
			</body>
		</html>
	);
}
