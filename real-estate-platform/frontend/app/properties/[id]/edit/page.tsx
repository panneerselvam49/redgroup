"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { propertyApi, getStoredUser } from "@/lib/api";
import type { Property } from "@/types/property";
import PropertyForm from "@/components/PropertyForm";
import Loading from "@/components/Loading";

export default function EditPropertyPage() {
	const router = useRouter();
	const params = useParams();
	const propertyId = Number(params["id"]);

	const [currentUser] = useState(() =>
		typeof window !== "undefined" ? getStoredUser() : null
	);

	const [property, setProperty] = useState<Property | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!currentUser) { router.push("/login"); return; }

		propertyApi.getById(propertyId)
			.then((res) => {
				const p = res.data.property;
				if (p.userId !== currentUser.id) {
					router.push(`/properties/${propertyId}`);
					return;
				}
				setProperty(p);
			})
			.catch(() => setError("Failed to load property"))
			.finally(() => setLoading(false));
	}, [propertyId, currentUser, router]);

	async function handleUpdate(data: Omit<Property, "id" | "userId" | "createdAt" | "updatedAt" | "owner">) {
		await propertyApi.update(propertyId, data);
		router.push(`/properties/${propertyId}`);
	}

	if (loading) return <div className="max-w-2xl mx-auto px-4 py-12"><Loading /></div>;
	if (error) return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-red-600 text-sm">{error}</div>;
	if (!property) return null;

	return (
		<div className="max-w-2xl mx-auto px-4 py-10">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">Edit Property</h1>
				<p className="text-slate-500 text-sm mt-1">Update your listing details</p>
			</div>
			<div className="bg-white rounded-2xl border border-stone-200 p-6">
				<PropertyForm
					initialData={property}
					propertyId={propertyId}
					onSubmit={handleUpdate}
					submitLabel="Save Changes"
				/>
			</div>
		</div>
	);
}
