
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("token");
}

export function setToken(token: string): void {
	localStorage.setItem("token", token);
}

export function removeToken(): void {
	localStorage.removeItem("token");
}

export function getStoredUser(): { id: number; name: string; email: string } | null {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem("user");
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function setStoredUser(user: { id: number; name: string; email: string }): void {
	localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth(): void {
	removeToken();
	localStorage.removeItem("user");
}

interface RequestOptions {
	method?: string;
	body?: unknown;
	auth?: boolean;
}

async function request<T>(
	path: string,
	options: RequestOptions = {}
): Promise<T> {
	const { method = "GET", body, auth = false } = options;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (auth) {
		const token = getToken();
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	// Handle 401 globally — clear auth and let components handle redirect
	if (response.status === 401) {
		clearAuth();
	}

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "An error occurred");
	}

	return data;
}

// Auth API
export const authApi = {
	register: (data: { name: string; email: string; password: string }) =>
		request<{ success: boolean; data: { token: string; user: { id: number; name: string; email: string } } }>(
			"/auth/register",
			{ method: "POST", body: data }
		),

	login: (data: { email: string; password: string }) =>
		request<{ success: boolean; data: { token: string; user: { id: number; name: string; email: string } } }>(
			"/auth/login",
			{ method: "POST", body: data }
		),

	me: () =>
		request<{ success: boolean; data: { id: number; name: string; email: string } }>(
			"/auth/me",
			{ auth: true }
		),
};

// Property API
import type { PropertyFilters, CreatePropertyData, PropertyListResponse, Property } from "@/types/property";

export const propertyApi = {
	getAll: (filters: PropertyFilters = {}) => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== "" && value !== null) {
				params.set(key, String(value));
			}
		});
		const query = params.toString();
		return request<{ success: boolean; data: PropertyListResponse }>(
			`/properties${query ? `?${query}` : ""}`
		);
	},

	getById: (id: number) =>
		request<{ success: boolean; data: { property: Property; similarProperties: Property[] } }>(
			`/properties/${id}`
		),

	create: (data: CreatePropertyData) =>
		request<{ success: boolean; data: Property }>(
			"/properties",
			{ method: "POST", body: data, auth: true }
		),

	update: (id: number, data: Partial<CreatePropertyData>) =>
		request<{ success: boolean; data: Property }>(
			`/properties/${id}`,
			{ method: "PUT", body: data, auth: true }
		),

	delete: (id: number) =>
		request<{ success: boolean; message: string }>(
			`/properties/${id}`,
			{ method: "DELETE", auth: true }
		),
};

// Inquiry API
export interface InquiryData {
	id: number;
	propertyId: number;
	userId: number;
	ownerId: number;
	message: string;
	createdAt: string;
	property?: {
		id: number;
		title: string;
		price: number;
		city: string;
		propertyType: string;
		images?: string[];
	};
	sender?: {
		id: number;
		name: string;
		email: string;
	};
}

export const inquiryApi = {
	create: (data: { propertyId: number; message: string }) =>
		request<{ success: boolean; message: string }>(
			"/inquiries",
			{ method: "POST", body: data, auth: true }
		),

	getReceived: () =>
		request<{ success: boolean; data: InquiryData[] }>(
			"/inquiries/received",
			{ auth: true }
		),
};

