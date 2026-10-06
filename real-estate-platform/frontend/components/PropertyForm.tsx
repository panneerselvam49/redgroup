"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CreatePropertyData, PropertyType } from "@/types/property";

interface PropertyFormProps {
	initialData?: Partial<CreatePropertyData>;
	propertyId?: number;
	onSubmit: (data: CreatePropertyData) => Promise<void>;
	submitLabel?: string;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
	{ value: "apartment", label: "Apartment" },
	{ value: "villa", label: "Villa" },
	{ value: "house", label: "House" },
	{ value: "plot", label: "Plot" },
];

const UPLOAD_SERVER = process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:5001";

const inputClass =
	"w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-800";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export default function PropertyForm({
	initialData,
	onSubmit,
	submitLabel = "Create Listing",
}: PropertyFormProps) {
	const router = useRouter();

	const [form, setForm] = useState<CreatePropertyData>({
		title: initialData?.title || "",
		description: initialData?.description || "",
		price: initialData?.price || 0,
		city: initialData?.city || "",
		location: initialData?.location || "",
		propertyType: initialData?.propertyType || "apartment",
		bedrooms: initialData?.bedrooms || 1,
		bathrooms: initialData?.bathrooms || 1,
		area: initialData?.area || 0,
		images: initialData?.images || [],
	});

	// Tracks previews for newly picked files (before upload)
	const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { name, value, type } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "number" ? Number(value) : value,
		}));
	}

	// show preview of uploaded file
	function handleFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		const remaining = 10 - form.images.length - previews.length;
		if (remaining <= 0) {
			setUploadError("Maximum 10 images allowed");
			return;
		}

		const picked = files.slice(0, remaining);
		const newPreviews = picked.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));
		setPreviews((prev) => [...prev, ...newPreviews]);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	// Upload all pending previews to the upload server
	async function uploadPending() {
		if (previews.length === 0) return;
		setUploading(true);
		setUploadError("");

		try {
			const formData = new FormData();
			previews.forEach(({ file }) => formData.append("images", file));

			const res = await fetch(`${UPLOAD_SERVER}/upload`, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(data.message || "Upload failed");
			}

			// Revoke old object URLs to avoid memory leaks
			previews.forEach(({ preview }) => URL.revokeObjectURL(preview));
			setPreviews([]);

			// Add the server-returned URLs to the form
			setForm((prev) => ({
				...prev,
				images: [...prev.images, ...(data.urls as string[])],
			}));
		} catch (err) {
			setUploadError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	}

	function removeExistingImage(index: number) {
		setForm((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	}

	function removePendingPreview(index: number) {
		setPreviews((prev) => {
			URL.revokeObjectURL(prev[index].preview);
			return prev.filter((_, i) => i !== index);
		});
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		if (previews.length > 0) {
			await uploadPending();
			if (uploadError) return;
		}

		setSubmitting(true);
		try {
			const formattedData: CreatePropertyData = {
				...form,
				price: Number(form.price),
				bedrooms: Number(form.bedrooms),
				bathrooms: Number(form.bathrooms),
				area: Number(form.area),
			};
			await onSubmit(formattedData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	}

	const totalImages = form.images.length + previews.length;

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{error && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
			)}

			{/* Title */}
			<div>
				<label htmlFor="title" className={labelClass}>Property Title *</label>
				<input id="title" name="title" type="text" required
					placeholder="e.g. Spacious 2BHK Apartment in Anna Nagar"
					value={form.title} onChange={handleChange} className={inputClass} />
			</div>

			{/* Description */}
			<div>
				<label htmlFor="description" className={labelClass}>Description *</label>
				<textarea id="description" name="description" required rows={4}
					placeholder="Describe the property in detail..."
					value={form.description} onChange={handleChange} className={inputClass} />
			</div>

			{/* Price + Area */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="price" className={labelClass}>Price (₹) *</label>
					<input id="price" name="price" type="number" required min={0}
						placeholder="e.g. 5000000"
						value={form.price || ""} onChange={handleChange} className={inputClass} />
				</div>
				<div>
					<label htmlFor="area" className={labelClass}>Area (sq.ft) *</label>
					<input id="area" name="area" type="number" required min={0}
						placeholder="e.g. 1200"
						value={form.area || ""} onChange={handleChange} className={inputClass} />
				</div>
			</div>

			{/* City + Location */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="city" className={labelClass}>City *</label>
					<input id="city" name="city" type="text" required placeholder="e.g. Chennai"
						value={form.city} onChange={handleChange} className={inputClass} />
				</div>
				<div>
					<label htmlFor="location" className={labelClass}>Area / Locality *</label>
					<input id="location" name="location" type="text" required placeholder="e.g. Anna Nagar"
						value={form.location} onChange={handleChange} className={inputClass} />
				</div>
			</div>

			{/* Property Type */}
			<div>
				<label htmlFor="propertyType" className={labelClass}>Property Type *</label>
				<select id="propertyType" name="propertyType" required
					value={form.propertyType} onChange={handleChange} className={inputClass}>
					{PROPERTY_TYPES.map((t) => (
						<option key={t.value} value={t.value}>{t.label}</option>
					))}
				</select>
			</div>

			{/* Bedrooms + Bathrooms */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="bedrooms" className={labelClass}>Bedrooms *</label>
					<input id="bedrooms" name="bedrooms" type="number" required min={0} max={20}
						value={form.bedrooms} onChange={handleChange} className={inputClass} />
				</div>
				<div>
					<label htmlFor="bathrooms" className={labelClass}>Bathrooms *</label>
					<input id="bathrooms" name="bathrooms" type="number" required min={0} max={20}
						value={form.bathrooms} onChange={handleChange} className={inputClass} />
				</div>
			</div>

			<div>
				<label className={labelClass}>
					Property Images
					<span className="text-slate-400 font-normal ml-1">({totalImages}/10)</span>
				</label>

				{/* Drop zone / pick button */}
				{totalImages < 10 && (
					<div
						onClick={() => fileInputRef.current?.click()}
						className="relative border-2 border-dashed border-stone-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors"
					>
						<input
							ref={fileInputRef}
							id="image-file-input"
							type="file"
							multiple
							accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
							onChange={handleFilesPicked}
							className="hidden"
						/>
						<div className="text-3xl mb-2">📷</div>
						<p className="text-sm text-slate-600 font-medium">Click to select images</p>
						<p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP up to 10 MB each</p>
					</div>
				)}

				{uploadError && (
					<p className="mt-2 text-red-600 text-xs bg-red-50 px-3 py-1.5 rounded-lg">{uploadError}</p>
				)}

				{/* Pending previews (local, not yet uploaded) */}
				{previews.length > 0 && (
					<div className="mt-3">
						<p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
							{previews.length} image{previews.length > 1 ? "s" : ""} ready to upload
						</p>
						<div className="grid grid-cols-4 gap-2">
							{previews.map(({ preview }, i) => (
								<div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-stone-100">
									<img src={preview} alt="" className="w-full h-full object-cover" />
									<button
										type="button"
										onClick={() => removePendingPreview(i)}
										className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
									>
										✕
									</button>
								</div>
							))}
						</div>
						<button
							type="button"
							id="upload-images-btn"
							onClick={uploadPending}
							disabled={uploading}
							className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-xs font-medium rounded-lg transition-colors"
						>
							{uploading ? "Uploading..." : `Upload ${previews.length} image${previews.length > 1 ? "s" : ""}`}
						</button>
					</div>
				)}

				{/* Already-uploaded images */}
				{form.images.length > 0 && (
					<div className="mt-3">
						<p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
							{form.images.length} uploaded image{form.images.length > 1 ? "s" : ""}
						</p>
						<div className="grid grid-cols-4 gap-2">
							{form.images.map((url, i) => (
								<div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-stone-100">
									<img src={url} alt="" className="w-full h-full object-cover" />
									<button
										type="button"
										onClick={() => removeExistingImage(i)}
										className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
									>
										✕
									</button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="flex gap-3 pt-2">
				<button
					type="submit"
					id="submit-property-btn"
					disabled={submitting || uploading}
					className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-colors text-sm"
				>
					{submitting ? "Saving..." : submitLabel}
				</button>
				<button
					type="button"
					onClick={() => router.back()}
					className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
