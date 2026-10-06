"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clearAuth, getStoredUser } from "@/lib/api";

export default function Navbar() {
	const router = useRouter();
	const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		setUser(getStoredUser());
		const handleStorage = () => setUser(getStoredUser());
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	function handleLogout() {
		clearAuth();
		setUser(null);
		router.push("/");
	}

	return (
		<nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">RE</span>
						</div>
						<span className="text-xl font-bold text-slate-900">EstateHub</span>
					</Link>

					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-6">
						<Link href="/properties" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
							Browse Properties
						</Link>
						{user ? (
							<>
								<Link href="/create-property" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
									+ List Property
								</Link>
								<Link href="/my-inquiries" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
									Inquiries
								</Link>
								<div className="flex items-center gap-3">
									<span className="text-sm text-slate-700">Hi, {user.name.split(" ")[0]}</span>
									<button
										id="logout-btn"
										onClick={handleLogout}
										className="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg transition-colors"
									>
										Logout
									</button>
								</div>
							</>
						) : (
							<div className="flex items-center gap-3">
								<Link href="/login" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
									Login
								</Link>
								<Link
									href="/register"
									className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
								>
									Register
								</Link>
							</div>
						)}
					</div>

					{/* Mobile hamburger */}
					<button
						id="mobile-menu-btn"
						className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-stone-100"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{menuOpen
								? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
						</svg>
					</button>
				</div>

				{/* Mobile menu */}
				{menuOpen && (
					<div className="md:hidden border-t border-stone-100 py-3 space-y-2">
						<Link href="/properties" className="block px-3 py-2 text-slate-700 hover:bg-stone-50 rounded-lg">
							Browse Properties
						</Link>
						{user ? (
							<>
								<Link href="/create-property" className="block px-3 py-2 text-slate-700 hover:bg-stone-50 rounded-lg">
									+ List Property
								</Link>
								<Link href="/my-inquiries" className="block px-3 py-2 text-slate-700 hover:bg-stone-50 rounded-lg">
									Inquiries
								</Link>
								<button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-stone-50 rounded-lg">
									Logout
								</button>
							</>
						) : (
							<>
								<Link href="/login" className="block px-3 py-2 text-slate-700 hover:bg-stone-50 rounded-lg">Login</Link>
								<Link href="/register" className="block px-3 py-2 text-amber-600 font-medium hover:bg-amber-50 rounded-lg">Register</Link>
							</>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}
