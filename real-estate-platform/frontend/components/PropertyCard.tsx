"use client";

import { useState } from "react";
import Link from "next/link";
import type { Property } from "@/types/property";

interface PropertyCardProps {
	property: Property;
}

function formatPrice(price: number): string {
	if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
	if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
	return `₹${price.toLocaleString()}`;
}

const typeStyle: Record<string, string> = {
	apartment: "bg-sky-50 text-sky-600 border border-sky-200",
	villa: "bg-violet-50 text-violet-600 border border-violet-200",
	house: "bg-emerald-50 text-emerald-600 border border-emerald-200",
	plot: "bg-amber-50 text-amber-600 border border-amber-200",
};

function NoImagePlaceholder() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
			<svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round"
					d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v10.5a1.5 1.5 0 001.5 1.5z" />
			</svg>
			<span className="text-xs text-slate-400">No image</span>
		</div>
	);
}

export default function PropertyCard({ property }: PropertyCardProps) {
	const badge = typeStyle[property.propertyType] ?? "bg-slate-50 text-slate-500 border border-slate-200";
	const images = property.images || [];
	const [activeImgIdx, setActiveImgIdx] = useState(0);

	const hasMultipleImages = images.length > 1;
	const currentImage = images[activeImgIdx] || null;

	const handlePrev = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	return (
		<Link
			href={`/properties/${property.id}`}
			className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
		>
			{/* Image */}
			<div className="relative w-full h-48 bg-slate-50 overflow-hidden">
				{currentImage ? (
					<>
						<img
							src={currentImage}
							alt={property.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>

						{hasMultipleImages && (
							<>
								<button
									type="button"
									onClick={handlePrev}
									className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
									title="Previous image"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								<button
									type="button"
									onClick={handleNext}
									className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
									title="Next image"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</button>
								<div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full pointer-events-none">
									{activeImgIdx + 1} / {images.length}
								</div>
							</>
						)}
					</>
				) : (
					<NoImagePlaceholder />
				)}
				<span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full capitalize ${badge}`}>
					{property.propertyType}
				</span>
			</div>

			{/* Content */}
			<div className="p-4">
				<h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors">
					{property.title}
				</h3>

				<p className="text-slate-700 font-bold text-base mb-2">{formatPrice(property.price)}</p>

				<p className="text-slate-400 text-xs mb-3 flex items-center gap-1">
					<svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span className="truncate">{property.location}, {property.city}</span>
				</p>

				<div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-3">
					{/* Beds */}
					<span className="flex items-center gap-1">
						<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5V19h18V9.5M1 14h22M7 9.5V7a2 2 0 012-2h6a2 2 0 012 2v2.5" />
						</svg>
						{property.bedrooms} Beds
					</span>
					{/* Baths */}
					<span className="flex items-center gap-1">
						<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16a1 1 0 011 1v3a7 7 0 01-14 0v-3a1 1 0 011-1zM6 10V6a3 3 0 016 0" />
						</svg>
						{property.bathrooms} Baths
					</span>
					{/* Area in sq.ft */}
					<span className="flex items-center gap-1">
						<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4m4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
						</svg>
						{property.area} sq.ft
					</span>
				</div>
			</div>
		</Link>
	);
}

