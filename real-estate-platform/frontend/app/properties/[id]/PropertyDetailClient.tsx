"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { propertyApi, inquiryApi, getStoredUser } from "@/lib/api";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import Loading from "@/components/Loading";

interface Props { propertyId: number; }

function formatPrice(price: number): string {
	if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
	if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
	return `₹${price.toLocaleString()}`;
}

// SVG icons for stat cards
function BedsIcon() {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5V19h18V9.5M1 14h22M7 9.5V7a2 2 0 012-2h6a2 2 0 012 2v2.5" />
		</svg>
	);
}
function BathIcon() {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16a1 1 0 011 1v3a7 7 0 01-14 0v-3a1 1 0 011-1zM6 10V6a3 3 0 016 0" />
		</svg>
	);
}
function AreaIcon() {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
		</svg>
	);
}
function TypeIcon() {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
		</svg>
	);
}

export default function PropertyDetailClient({ propertyId }: Props) {
	const router = useRouter();
	const currentUser = typeof window !== "undefined" ? getStoredUser() : null;

	const [property, setProperty] = useState<Property | null>(null);
	const [similar, setSimilar] = useState<Property[]>([]);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const [activeImage, setActiveImage] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	const [message, setMessage] = useState("");
	const [inquiryLoading, setInquiryLoading] = useState(false);
	const [inquirySuccess, setInquirySuccess] = useState(false);
	const [inquiryError, setInquiryError] = useState("");
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		propertyApi.getById(propertyId)
			.then((res) => {
				setProperty(res.data.property);
				setSimilar(res.data.similarProperties);
			})
			.catch(() => setNotFound(true))
			.finally(() => setLoading(false));
	}, [propertyId]);

	const totalImages = property?.images?.length || 0;

	const handlePrev = useCallback((e?: React.MouseEvent) => {
		e?.stopPropagation();
		if (totalImages <= 1) return;
		setActiveImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
	}, [totalImages]);

	const handleNext = useCallback((e?: React.MouseEvent) => {
		e?.stopPropagation();
		if (totalImages <= 1) return;
		setActiveImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
	}, [totalImages]);

	// Keyboard shortcut handling for Lightbox modal
	useEffect(() => {
		if (!isLightboxOpen) return;
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setIsLightboxOpen(false);
			if (e.key === "ArrowLeft") handlePrev();
			if (e.key === "ArrowRight") handleNext();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isLightboxOpen, handlePrev, handleNext]);

	async function handleInquiry(e: React.FormEvent) {
		e.preventDefault();
		setInquiryError("");
		setInquiryLoading(true);
		try {
			await inquiryApi.create({ propertyId, message });
			setInquirySuccess(true);
			setMessage("");
		} catch (err) {
			setInquiryError(err instanceof Error ? err.message : "Failed to send inquiry");
		} finally {
			setInquiryLoading(false);
		}
	}

	async function handleDelete() {
		if (!confirm("Delete this property? This cannot be undone.")) return;
		setDeleting(true);
		try {
			await propertyApi.delete(propertyId);
			router.push("/properties");
		} catch (err) {
			alert(err instanceof Error ? err.message : "Delete failed");
			setDeleting(false);
		}
	}

	if (loading) return <div className="max-w-5xl mx-auto px-4 py-12"><Loading text="Loading property..." /></div>;

	if (notFound || !property) {
		return (
			<div className="max-w-5xl mx-auto px-4 py-20 text-center">
				<div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
					</svg>
				</div>
				<h1 className="text-xl font-bold text-slate-800 mb-2">Property Not Found</h1>
				<p className="text-slate-400 mb-6 text-sm">This property may have been removed or the link is incorrect.</p>
				<Link href="/properties" className="text-sky-600 hover:underline text-sm">← Back to listings</Link>
			</div>
		);
	}

	const isOwner = currentUser?.id === property.userId;
	const isLoggedIn = !!currentUser;

	const stats = [
		{ label: "Bedrooms", value: `${property.bedrooms} BHK`, icon: <BedsIcon />, cap: false },
		{ label: "Bathrooms", value: String(property.bathrooms), icon: <BathIcon />, cap: false },
		{ label: "Area", value: `${property.area} sq.ft`, icon: <AreaIcon />, cap: false },
		{ label: "Type", value: property.propertyType, icon: <TypeIcon />, cap: true },
	];

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
				<Link href="/" className="hover:text-sky-600">Home</Link>
				<span>/</span>
				<Link href="/properties" className="hover:text-sky-600">Properties</Link>
				<span>/</span>
				<span className="text-slate-600 truncate max-w-xs">{property.title}</span>
			</nav>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					{/* Gallery */}
					<div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
						<div className="relative h-80 sm:h-96 bg-slate-900 group cursor-pointer" onClick={() => totalImages > 0 && setIsLightboxOpen(true)}>
							{property.images?.length > 0
								? (
									<>
										<img
											src={property.images[activeImage]}
											alt={property.title}
											className="w-full h-full object-cover transition-opacity duration-300"
										/>
										<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
											<span className="bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-lg">
												<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
												</svg>
												Click to view full image
											</span>
										</div>

										{totalImages > 1 && (
											<>
												<button
													type="button"
													onClick={handlePrev}
													title="Previous image"
													className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all hover:scale-110 focus:outline-none"
												>
													<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
													</svg>
												</button>
												<button
													type="button"
													onClick={handleNext}
													title="Next image"
													className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all hover:scale-110 focus:outline-none"
												>
													<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
													</svg>
												</button>
											</>
										)}

										<div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
											{activeImage + 1} / {totalImages}
										</div>
									</>
								)
								: (
									<div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
										<svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round"
												d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v10.5a1.5 1.5 0 001.5 1.5z" />
										</svg>
										<span className="text-xs text-slate-400">No images available</span>
									</div>
								)}
						</div>
						{totalImages > 1 && (
							<div className="flex gap-2 p-3 overflow-x-auto bg-slate-50 border-t border-slate-100">
								{property.images.map((img, i) => (
									<button key={i} onClick={() => setActiveImage(i)}
										className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-amber-500 ring-2 ring-amber-500/20 scale-105" : "border-transparent opacity-70 hover:opacity-100"
											}`}>
										<img src={img} alt="" className="w-full h-full object-cover" />
									</button>
								))}
							</div>
						)}
					</div>

					{/* Details */}
					<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
						<div className="flex items-start justify-between gap-4 mb-2">
							<h1 className="text-xl font-bold text-slate-800 leading-snug">{property.title}</h1>
							{isOwner && (
								<div className="flex gap-2 flex-shrink-0">
									<Link href={`/properties/${property.id}/edit`}
										className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition-colors">
										Edit
									</Link>
									<button onClick={handleDelete} disabled={deleting}
										className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
										{deleting ? "Deleting..." : "Delete"}
									</button>
								</div>
							)}
						</div>

						<p className="text-slate-800 text-2xl font-bold mb-3">{formatPrice(property.price)}</p>

						<p className="text-slate-400 text-sm mb-5 flex items-center gap-1.5">
							<svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							{property.location}, {property.city}
						</p>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
							{stats.map(({ label, value, icon, cap }) => (
								<div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 flex flex-col items-center gap-1.5">
									<div className="text-slate-400">{icon}</div>
									<div className={`font-semibold text-slate-800 text-sm ${cap ? "capitalize" : ""}`}>{value}</div>
									<div className="text-xs text-slate-400">{label}</div>
								</div>
							))}
						</div>

						<h2 className="font-semibold text-slate-700 mb-2 text-sm">About this property</h2>
						<p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
					</div>
				</div>

				<div className="space-y-5">
					{/* Owner */}
					{property.owner && (
						<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
							<h3 className="font-semibold text-slate-700 mb-3 text-sm">Listed By</h3>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
									{property.owner.name[0].toUpperCase()}
								</div>
								<div>
									<p className="font-medium text-slate-800 text-sm">{property.owner.name}</p>
									{property.owner.email && (
										<p className="text-xs text-slate-400">{property.owner.email}</p>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Inquiry form */}
					{!isOwner && (
						<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
							<h3 className="font-semibold text-slate-700 mb-3 text-sm">Contact Owner</h3>

							{!isLoggedIn ? (
								<div className="text-center py-4">
									<p className="text-slate-400 text-sm mb-3">Please log in to send an inquiry</p>
									<Link href="/login"
										className="inline-block px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
										Log In
									</Link>
								</div>
							) : inquirySuccess ? (
								<div className="text-center py-4">
									<div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
										<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<p className="text-emerald-700 font-medium text-sm">Inquiry sent!</p>
									<p className="text-slate-400 text-xs mt-1">The owner will contact you soon.</p>
								</div>
							) : (
								<form onSubmit={handleInquiry} className="space-y-3">
									{inquiryError && (
										<p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg border border-red-100">{inquiryError}</p>
									)}
									<textarea
										id="inquiry-message"
										rows={4}
										required
										placeholder="Hi, I am interested in this property..."
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none text-slate-700 bg-slate-50"
									/>
									<button id="send-inquiry-btn" type="submit" disabled={inquiryLoading}
										className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-colors">
										{inquiryLoading ? "Sending..." : "Send Inquiry"}
									</button>
								</form>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Similar properties */}
			{similar.length > 0 && (
				<section className="mt-12">
					<h2 className="text-xl font-bold text-slate-800 mb-5">Similar Properties</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{similar.map((p) => <PropertyCard key={p.id} property={p} />)}
					</div>
				</section>
			)}

			{isLightboxOpen && totalImages > 0 && (
				<div
					className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none"
					onClick={() => setIsLightboxOpen(false)}
				>
					<div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
						<div className="flex items-center gap-3">
							<span className="text-sm font-medium text-slate-300 truncate max-w-xs sm:max-w-md">
								{property.title}
							</span>
							<span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-amber-400 font-semibold">
								{activeImage + 1} / {totalImages}
							</span>
						</div>
						<button
							type="button"
							onClick={() => setIsLightboxOpen(false)}
							className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors focus:outline-none"
							title="Close (Esc)"
						>
							<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
						{totalImages > 1 && (
							<button
								type="button"
								onClick={handlePrev}
								className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-amber-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all hover:scale-110 focus:outline-none border border-slate-700/50"
								title="Previous (Left Arrow)"
							>
								<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
						)}

						<img
							src={property.images[activeImage]}
							alt={property.title}
							className="max-h-[78vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
						/>

						{/* Next Button */}
						{totalImages > 1 && (
							<button
								type="button"
								onClick={handleNext}
								className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-amber-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all hover:scale-110 focus:outline-none border border-slate-700/50"
								title="Next (Right Arrow)"
							>
								<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						)}
					</div>

					{totalImages > 1 && (
						<div className="flex justify-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
							{property.images.map((img, i) => (
								<button
									key={i}
									onClick={() => setActiveImage(i)}
									className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-amber-500 ring-2 ring-amber-500/50 scale-105" : "border-transparent opacity-40 hover:opacity-90"
										}`}
								>
									<img src={img} alt="" className="w-full h-full object-cover" />
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

