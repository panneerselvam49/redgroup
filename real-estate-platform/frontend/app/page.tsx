"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();
	const [search, setSearch] = useState("");

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		router.push(`/properties?city=${encodeURIComponent(search)}`);
	}

	const stats = [
		{
			label: "Active Listings",
			value: "50,000+",
			icon: (
				<svg className="w-6 h-6 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6" />
				</svg>
			),
		},
		{
			label: "Cities Covered",
			value: "100+",
			icon: (
				<svg className="w-6 h-6 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
				</svg>
			),
		},
		{
			label: "Happy Buyers",
			value: "10,000+",
			icon: (
				<svg className="w-6 h-6 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			),
		},
		{
			label: "Properties Sold",
			value: "5,000+",
			icon: (
				<svg className="w-6 h-6 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
				</svg>
			),
		},
	];

	const propertyTypes = [
		{
			type: "apartment",
			label: "Apartments",
			desc: "Modern city living",
			color: "hover:border-sky-300 hover:bg-sky-50/50 group-hover:text-sky-600",
			badgeBg: "bg-sky-100 text-sky-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6M9 7h1m-1 4h1m4-4h1m-1 4h1" />
				</svg>
			),
		},
		{
			type: "villa",
			label: "Villas",
			desc: "Luxury & privacy",
			color: "hover:border-rose-300 hover:bg-rose-50/50 group-hover:text-rose-600",
			badgeBg: "bg-rose-100 text-rose-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			),
		},
		{
			type: "house",
			label: "Houses",
			desc: "Family homes",
			color: "hover:border-emerald-300 hover:bg-emerald-50/50 group-hover:text-emerald-600",
			badgeBg: "bg-emerald-100 text-emerald-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" />
				</svg>
			),
		},
		{
			type: "plot",
			label: "Plots",
			desc: "Build your dream",
			color: "hover:border-amber-300 hover:bg-amber-50/50 group-hover:text-amber-600",
			badgeBg: "bg-amber-100 text-amber-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.818V8.044a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
				</svg>
			),
		},
	];

	return (
		<>
			<section
				className="relative overflow-hidden py-24 px-4"
				style={{
					background: "linear-gradient(135deg, #fdf6ec 0%, #fef9f0 40%, #fff7ed 70%, #fef3c7 100%)",
				}}
			>
				<div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
				<div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

				<div className="relative max-w-4xl mx-auto text-center">
					<span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-5 tracking-wide uppercase">
						India&apos;s Trusted Property Platform
					</span>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
						Find Your <span className="text-amber-500">Perfect</span> Home
					</h1>

					<p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
						Search verified properties across India — apartments, villas, houses and plots all in one place.
					</p>

					{/* Search bar */}
					<form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-stone-200">
						<input
							id="hero-search"
							type="text"
							placeholder="Search by city — Chennai, Bangalore, Mumbai..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="flex-1 px-5 py-4 text-slate-800 text-sm focus:outline-none bg-transparent placeholder-slate-400"
						/>
						<button
							id="hero-search-btn"
							type="submit"
							className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-2"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							Search
						</button>
					</form>

					<p className="mt-4 text-xs text-slate-400">
						Popular: <Link href="/properties?city=Chennai" className="hover:text-amber-600 underline-offset-2 hover:underline">Chennai</Link>
						{" · "}<Link href="/properties?city=Bangalore" className="hover:text-amber-600 hover:underline underline-offset-2">Bangalore</Link>
						{" · "}<Link href="/properties?city=Mumbai" className="hover:text-amber-600 hover:underline underline-offset-2">Mumbai</Link>
						{" · "}<Link href="/properties?city=Hyderabad" className="hover:text-amber-600 hover:underline underline-offset-2">Hyderabad</Link>
					</p>
				</div>
			</section>

			<section className="bg-white border-y border-stone-100">
				<div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
					{stats.map((stat) => (
						<div key={stat.label} className="text-center">
							<div className="mb-2.5 flex justify-center">{stat.icon}</div>
							<div className="text-2xl font-bold text-amber-600">{stat.value}</div>
							<div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
						</div>
					))}
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 py-14">
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-slate-900 mb-1">Browse by Property Type</h2>
					<p className="text-slate-500 text-sm">Find exactly what you are looking for</p>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{propertyTypes.map(({ type, label, icon, desc, color, badgeBg }) => (
						<Link
							key={type}
							href={`/properties?propertyType=${type}`}
							className={`group bg-white rounded-2xl border border-stone-200 p-6 text-center transition-all duration-200 hover:shadow-md ${color}`}
						>
							<div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${badgeBg}`}>
								{icon}
							</div>
							<div className="font-semibold text-slate-900 transition-colors">{label}</div>
							<div className="text-xs text-slate-500 mt-1">{desc}</div>
						</Link>
					))}
				</div>
			</section>

			<section className="bg-white py-14">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-2xl font-bold text-slate-900 mb-1">Latest Listings</h2>
							<p className="text-slate-500 text-sm">Recently added properties</p>
						</div>
						<Link href="/properties" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
							View All →
						</Link>
					</div>
					<FeaturedProperties />
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 py-14">
				<div
					className="rounded-3xl p-10 text-center overflow-hidden relative"
					style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)" }}
				>
					<div className="absolute inset-0 opacity-10"
						style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
					<div className="relative">
						<h2 className="text-2xl font-bold text-white mb-3">Own a property? List it for free!</h2>
						<p className="text-amber-100 mb-6 max-w-lg mx-auto text-sm">
							Reach thousands of verified buyers. Create your listing in under 5 minutes.
						</p>
						<Link
							href="/create-property"
							className="inline-block px-8 py-3 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-colors shadow-md"
						>
							List Your Property →
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}

function FeaturedProperties() {
	const [properties, setProperties] = useState<
		{ id: number; title: string; price: number; city: string; location: string; propertyType: string; images: string[] }[]
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
		fetch(`${BASE}/properties?limit=6&sort=newest`)
			.then((r) => r.json())
			.then((d) => { if (d.success) setProperties(d.data.properties); })
			.catch(() => { })
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="bg-stone-100 rounded-2xl h-64 animate-pulse" />
				))}
			</div>
		);
	}

	if (properties.length === 0) {
		return (
			<div className="text-center py-12 text-slate-400">
				<svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6" />
				</svg>
				<p className="text-sm">No listings yet. <Link href="/create-property" className="text-amber-600 hover:underline">Be the first!</Link></p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{properties.map((p) => {
				const fmt = (price: number) => {
					if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
					if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
					return `₹${price.toLocaleString()}`;
				};
				return (
					<Link key={p.id} href={`/properties/${p.id}`}
						className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
						<div className="h-44 bg-slate-100 overflow-hidden relative flex items-center justify-center">
							{p.images?.[0]
								? /* eslint-disable-next-line @next/next/no-img-element */
								<img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
								: (
									<svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
									</svg>
								)}
						</div>
						<div className="p-4">
							<p className="font-semibold text-sm text-slate-900 truncate group-hover:text-amber-600 transition-colors">{p.title}</p>
							<p className="text-amber-600 font-bold mt-1">{fmt(p.price)}</p>
							<p className="text-xs text-slate-400 mt-1">{p.location}, {p.city}</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
}

