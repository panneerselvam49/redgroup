"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { propertyApi } from "@/lib/api";
import type { Property, PropertyFilters } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import PropertyFiltersComponent from "@/components/PropertyFilters";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";

// Inner component that uses useSearchParams — must be wrapped in Suspense
function PropertiesContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [properties, setProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [filters, setFilters] = useState<PropertyFilters>({
		city: searchParams.get("city") || undefined,
		propertyType: (searchParams.get("propertyType") as PropertyFilters["propertyType"]) || undefined,
		minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
		maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
		bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
		sort: (searchParams.get("sort") as PropertyFilters["sort"]) || "newest",
		page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
		limit: 10,
	});

	const fetchProperties = useCallback(async (f: PropertyFilters) => {
		setLoading(true);
		setError("");
		try {
			const res = await propertyApi.getAll(f);
			setProperties(res.data.properties);
			setTotal(res.data.total);
			setTotalPages(res.data.totalPages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load properties");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { fetchProperties(filters); }, [filters, fetchProperties]);

	function handleFilterChange(newFilters: PropertyFilters) {
		const updated = { ...newFilters, page: 1 };
		setFilters(updated);
		const params = new URLSearchParams();
		Object.entries(updated).forEach(([k, v]) => {
			if (v !== undefined && v !== "") params.set(k, String(v));
		});
		router.push(`/properties?${params.toString()}`, { scroll: false });
	}

	function handlePageChange(page: number) {
		setFilters((prev) => ({ ...prev, page }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-800">
					{filters.city ? `Properties in ${filters.city}` : "All Properties"}
				</h1>
				{!loading && (
					<p className="text-slate-400 text-sm mt-1">
						<span className="font-semibold text-slate-600">{total}</span> properties found
					</p>
				)}
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Filters sidebar */}
				<aside className="w-full lg:w-64 flex-shrink-0">
					<PropertyFiltersComponent filters={filters} onFilterChange={handleFilterChange} />
				</aside>

				{/* Results */}
				<div className="flex-1">
					{loading ? (
						<Loading text="Loading properties..." />
					) : error ? (
						<div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
							<div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
								<svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<p className="text-red-700 text-sm font-medium">{error}</p>
								<button onClick={() => fetchProperties(filters)} className="mt-1 text-xs text-red-500 hover:text-red-700 underline">
									Try again
								</button>
							</div>
						</div>
					) : properties.length === 0 ? (
						<div className="bg-white border border-slate-100 rounded-2xl p-14 text-center shadow-sm">
							<div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
								</svg>
							</div>
							<h3 className="font-semibold text-slate-700 mb-1">No properties found</h3>
							<p className="text-slate-400 text-sm">Try adjusting your filters or searching a different city.</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
								{properties.map((property) => (
									<PropertyCard key={property.id} property={property} />
								))}
							</div>
							<Pagination page={filters.page || 1} totalPages={totalPages} onPageChange={handlePageChange} />
						</>
					)}
				</div>
			</div>
		</div>
	);
}

// Outer page wrapper — Suspense is required here because PropertiesContent uses useSearchParams()
export default function PropertiesPage() {
	return (
		<Suspense fallback={<Loading text="Loading properties..." />}>
			<PropertiesContent />
		</Suspense>
	);
}
