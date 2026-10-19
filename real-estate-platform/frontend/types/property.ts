export type PropertyType = "apartment" | "villa" | "house" | "plot";

export interface PropertyOwner {
	id: number;
	name: string;
	email?: string;
}

export interface Property {
	id: number;
	userId: number;
	title: string;
	description: string;
	price: number;
	city: string;
	location: string;
	propertyType: PropertyType;
	bedrooms: number;
	bathrooms: number;
	area: number;
	images: string[];
	createdAt: string;
	updatedAt: string;
	owner?: PropertyOwner;
}

export interface PropertyListResponse {
	properties: Property[];
	total: number;
	page: number;
	totalPages: number;
}

export interface PropertyFilters {
	city?: string;
	location?: string;
	minPrice?: number;
	maxPrice?: number;
	propertyType?: PropertyType;
	bedrooms?: number;
	sort?: "price_asc" | "price_desc" | "newest" | "oldest";
	page?: number;
	limit?: number;
}

export interface CreatePropertyData {
	title: string;
	description: string;
	price: number;
	city: string;
	location: string;
	propertyType: PropertyType;
	bedrooms: number;
	bathrooms: number;
	area: number;
	images: string[];
}

export interface User {
	id: number;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}
