"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertyApi, getStoredUser } from "@/lib/api";
import type { CreatePropertyData } from "@/types/property";
import PropertyForm from "@/components/PropertyForm";

export default function CreatePropertyPage() {
	const router = useRouter();
	const currentUser = typeof window !== "undefined" ? getStoredUser() : null;

	useEffect(() => {
		if (!currentUser) router.push("/login");
	}, [currentUser, router]);

	async function handleCreate(data: CreatePropertyData) {
		const res = await propertyApi.create(data);
		router.push(`/properties/${res.data.id}`);
	}

	if (!currentUser) return null;

	return (
		<div className="max-w-2xl mx-auto px-4 py-10">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">List Your Property</h1>
				<p className="text-slate-500 text-sm mt-1">Fill in the details to create a new listing</p>
			</div>
			<div className="bg-white rounded-2xl border border-stone-200 p-6">
				<PropertyForm onSubmit={handleCreate} submitLabel="Create Listing" />
			</div>
		</div>
	);
}
