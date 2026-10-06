"use client";

import { useState } from "react";
import type { PropertyFilters, PropertyType } from "@/types/property";

interface PropertyFiltersProps {
	filters: PropertyFilters;
	onFilterChange: (filters: PropertyFilters) => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
	{ value: "apartment", label: "Apartment" },
	{ value: "villa", label: "Villa" },
	{ value: "house", label: "House" },
	{ value: "plot", label: "Plot" },
];

const inputClass =
	"w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-800";

export default function PropertyFilters({ filters, onFilterChange }: PropertyFiltersProps) {
	const [local, setLocal] = useState<PropertyFilters>(filters);

	function set(key: keyof PropertyFilters, value: string | number | undefined) {
		setLocal((prev) => ({ ...prev, [key]: value, page: 1 }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onFilterChange({ ...local, page: 1 });
	}

	function handleReset() {
		const reset: PropertyFilters = { sort: "newest", page: 1, limit: 10 };
		setLocal(reset);
		onFilterChange(reset);
	}

	return (
		<form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
			<h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
				<svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
				</svg>
				Filter Properties
			</h3>

			<div>
				<label className="block text-xs font-medium text-slate-500 mb-1">City</label>
				<input id="filter-city" type="text" placeholder="e.g. Chennai, Mumbai"
					value={local.city || ""}
					onChange={(e) => set("city", e.target.value || undefined)}
					className={inputClass} />
			</div>

			<div>
				<label className="block text-xs font-medium text-slate-500 mb-1">Property Type</label>
				<select id="filter-type"
					value={local.propertyType || ""}
					onChange={(e) => set("propertyType", (e.target.value as PropertyType) || undefined)}
					className={inputClass}>
					<option value="">All Types</option>
					{PROPERTY_TYPES.map((t) => (
						<option key={t.value} value={t.value}>{t.label}</option>
					))}
				</select>
			</div>

			<div>
				<label className="block text-xs font-medium text-slate-500 mb-1">Bedrooms</label>
				<select id="filter-bedrooms"
					value={local.bedrooms ?? ""}
					onChange={(e) => set("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
					className={inputClass}>
					<option value="">Any</option>
					{[1, 2, 3, 4, 5].map((n) => (
						<option key={n} value={n}>{n}+ BHK</option>
					))}
				</select>
			</div>

			<div>
				<label className="block text-xs font-medium text-slate-500 mb-1">Min Price (₹)</label>
				<input id="filter-min-price" type="number" placeholder="e.g. 500000" min={1}
					value={local.minPrice || ""}
					onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
					className={inputClass} />
			</div>

			<div>
				<label className="block text-xs font-medium text-slate-500 mb-1">Max Price (₹)</label>
				<input id="filter-max-price" type="number" placeholder="e.g. 10000000" min={1}
					value={local.maxPrice || ""}
					onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
					className={inputClass} />
			</div>

			<div>
				<label className="block text-xs font-medium text-slate-500 mb-1">Sort By</label>
				<select id="filter-sort"
					value={local.sort || "newest"}
					onChange={(e) => set("sort", e.target.value as PropertyFilters["sort"])}
					className={inputClass}>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="price_asc">Price: Low → High</option>
					<option value="price_desc">Price: High → Low</option>
				</select>
			</div>

			<div className="flex gap-2 pt-1">
				<button id="apply-filters-btn" type="submit"
					className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
					Apply
				</button>
				<button id="reset-filters-btn" type="button" onClick={handleReset}
					className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
					Reset
				</button>
			</div>
		</form>
	);
}
