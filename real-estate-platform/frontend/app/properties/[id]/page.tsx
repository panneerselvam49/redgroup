import { Metadata } from "next";
import PropertyDetailClient from "./PropertyDetailClient";

type Params = { id: string };

async function fetchProperty(id: string) {
	const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
	try {
		const res = await fetch(`${BASE}/properties/${id}`, {
		});
		if (!res.ok) return null;
		const data = await res.json();
		return data.data?.property ?? null;
	} catch {
		return null;
	}
}

// Dynamic metadata for SEO
export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { id } = await params;
	const property = await fetchProperty(id);

	if (!property) {
		return {
			title: "Property Not Found | EstateHub",
			description: "The property you are looking for could not be found.",
		};
	}

	const formatPrice = (price: number) => {
		if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
		if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
		return `₹${price.toLocaleString()}`;
	};

	return {
		title: `${property.title} | EstateHub`,
		description: `${property.propertyType} for sale in ${property.location}, ${property.city}. ${property.bedrooms} BHK, ${property.area} sq.ft at ${formatPrice(property.price)}. ${property.description.slice(0, 100)}...`,
		openGraph: {
			title: property.title,
			description: `${property.propertyType} in ${property.city} at ${formatPrice(property.price)}`,
			images: property.images?.[0] ? [{ url: property.images[0] }] : [],
		},
	};
}

export default async function PropertyDetailPage({
	params,
}: {
	params: Promise<Params>;
}) {
	const { id } = await params;
	// We pass the id to a client component that handles interactivity
	// (inquiry form, delete/edit buttons based on auth state)
	return <PropertyDetailClient propertyId={Number(id)} />;
}
