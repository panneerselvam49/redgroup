"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inquiryApi, getStoredUser, InquiryData } from "@/lib/api";

function PropertyTypeIcon({ type }: { type: string }) {
	switch (type?.toLowerCase()) {
		case "apartment":
			return (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
					<rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
					<path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9M15 21V9M9 13h2M13 13h2M9 17h2M13 17h2" />
				</svg>
			);
		case "villa":
			return (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10l7-7 7 7v11M10 21v-5h4v5" />
					<path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4" />
				</svg>
			);
		case "house":
			return (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			);
		case "plot":
			return (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
				</svg>
			);
		default:
			return (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
				</svg>
			);
	}
}

function getTypeBadgeClass(type: string): string {
	switch (type?.toLowerCase()) {
		case "apartment": return "bg-sky-50 text-sky-600 border border-sky-200";
		case "villa":     return "bg-violet-50 text-violet-600 border border-violet-200";
		case "house":     return "bg-emerald-50 text-emerald-600 border border-emerald-200";
		case "plot":      return "bg-amber-50 text-amber-600 border border-amber-200";
		default:          return "bg-slate-50 text-slate-500 border border-slate-200";
	}
}

function getStripeClass(type: string): string {
	switch (type?.toLowerCase()) {
		case "apartment": return "bg-sky-400";
		case "villa":     return "bg-violet-400";
		case "house":     return "bg-emerald-400";
		case "plot":      return "bg-amber-400";
		default:          return "bg-slate-300";
	}
}

export default function MyInquiriesPage() {
	const router = useRouter();
	const [inquiries, setInquiries] = useState<InquiryData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const user = getStoredUser();
		if (!user) {
			router.push("/login?redirect=/my-inquiries");
			return;
		}

		async function fetchInquiries() {
			try {
				setLoading(true);
				setError("");
				const res = await inquiryApi.getReceived();
				setInquiries(res.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load inquiries");
			} finally {
				setLoading(false);
			}
		}

		fetchInquiries();
	}, [router]);

	return (
		<main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">

				{/* ── Page Header ── */}
				<div className="flex items-center gap-3 mb-8">
					<div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
						<svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
						</svg>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-slate-800 leading-tight">Received Inquiries</h1>
						<p className="text-sm text-slate-400 mt-0.5">Messages from buyers &amp; renters interested in your listings</p>
					</div>
				</div>

				{/* ── Loading Skeleton ── */}
				{loading && (
					<div className="space-y-3">
						{[1, 2, 3].map((n) => (
							<div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse flex">
								<div className="w-1 bg-slate-200 shrink-0" />
								<div className="flex-1 p-5">
									<div className="h-4 bg-slate-100 rounded w-28 mb-3" />
									<div className="h-5 bg-slate-100 rounded w-2/5 mb-2" />
									<div className="h-3 bg-slate-100 rounded w-1/4 mb-4" />
									<div className="h-12 bg-slate-50 rounded-xl mb-3" />
									<div className="h-3 bg-slate-100 rounded w-1/3" />
								</div>
							</div>
						))}
					</div>
				)}

				{/* ── Error State ── */}
				{!loading && error && (
					<div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
						<div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
							<svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<p className="font-medium text-red-700 text-sm">{error}</p>
							<button onClick={() => window.location.reload()} className="text-xs text-red-500 hover:text-red-700 underline mt-1">
								Try again
							</button>
						</div>
					</div>
				)}

				{/* ── Empty State ── */}
				{!loading && !error && inquiries.length === 0 && (
					<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center">
						<div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-slate-700 mb-1">No inquiries yet</h3>
						<p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
							Once buyers or renters send messages for your properties, they will show up here.
						</p>
						<Link
							href="/create-property"
							className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
							</svg>
							List a Property
						</Link>
					</div>
				)}

				{/* ── Inquiry Cards ── */}
				{!loading && !error && inquiries.length > 0 && (
					<div className="space-y-3">
						{/* Count badge */}
						<p className="text-xs text-slate-400 font-medium mb-1">
							{inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"} received
						</p>

						{inquiries.map((inquiry) => {
							const propType = inquiry.property?.propertyType || "";
							const formattedDate = inquiry.createdAt
								? new Date(inquiry.createdAt).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})
								: "";

							return (
								<div
									key={inquiry.id}
									className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex"
								>
									{/* Left accent stripe */}
									<div className={`w-1 shrink-0 ${getStripeClass(propType)}`} />

									<div className="flex-1 p-5">
										{/* Top row: badge + date */}
										<div className="flex items-center justify-between gap-2 mb-3">
											<span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${getTypeBadgeClass(propType)}`}>
												<PropertyTypeIcon type={propType} />
												{propType ? propType.charAt(0).toUpperCase() + propType.slice(1) : "Property"}
											</span>
											{formattedDate && (
												<span className="flex items-center gap-1 text-xs text-slate-400">
													<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
													{formattedDate}
												</span>
											)}
										</div>

										{/* Property title & location */}
										<div className="mb-3">
											<h2 className="text-base font-semibold text-slate-800 leading-snug">
												{inquiry.property ? (
													<Link
														href={`/properties/${inquiry.property.id}`}
														className="hover:text-sky-600 transition-colors"
													>
														{inquiry.property.title}
													</Link>
												) : (
													`Property #${inquiry.propertyId}`
												)}
											</h2>
											{inquiry.property && (
												<p className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
													<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
													</svg>
													{inquiry.property.city}
													<span className="text-slate-200">•</span>
													<span className="text-slate-500 font-medium">₹{inquiry.property.price.toLocaleString("en-IN")}</span>
												</p>
											)}
										</div>

										{/* Message bubble */}
										<div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-4">
											<p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
										</div>

										{/* Sender row */}
										<div className="flex items-center justify-between gap-3">
											<div className="flex items-center gap-2.5">
												{/* Avatar */}
												<div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xs shrink-0">
													{inquiry.sender?.name?.charAt(0).toUpperCase() ?? "U"}
												</div>
												<div>
													<p className="text-sm font-medium text-slate-700 leading-tight">
														{inquiry.sender?.name ?? "Interested User"}
													</p>
													<p className="text-xs text-slate-400 leading-tight">{inquiry.sender?.email}</p>
												</div>
											</div>

											{/* Reply button */}
											{inquiry.sender?.email && (
												<a
													href={`mailto:${inquiry.sender.email}?subject=RE: ${encodeURIComponent(
														inquiry.property?.title ?? "Your property inquiry"
													)}`}
													className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors shrink-0"
												>
													<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
													</svg>
													Reply
												</a>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}
