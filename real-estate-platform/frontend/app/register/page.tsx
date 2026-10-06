"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, setToken, setStoredUser } from "@/lib/api";

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await authApi.register(form);
			setToken(res.data.token);
			setStoredUser(res.data.user);
			window.dispatchEvent(new Event("storage"));
			router.push("/properties");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setLoading(false);
		}
	}

	const inputClass =
		"w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800";

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-stone-50">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
					{/* Logo */}
					<div className="text-center mb-8">
						<div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
							<span className="text-white font-bold text-lg">RE</span>
						</div>
						<h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
						<p className="text-slate-500 text-sm mt-1">Join EstateHub today — it&apos;s free</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
							<input id="name" name="name" type="text" required autoComplete="name"
								placeholder="John Doe" value={form.name} onChange={handleChange} className={inputClass} />
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
							<input id="email" name="email" type="email" required autoComplete="email"
								placeholder="john@example.com" value={form.email} onChange={handleChange} className={inputClass} />
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
							<input id="password" name="password" type="password" required autoComplete="new-password"
								placeholder="At least 6 characters" value={form.password} onChange={handleChange} className={inputClass} />
						</div>

						<button
							id="register-submit-btn"
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition-colors text-sm mt-2"
						>
							{loading ? "Creating account..." : "Create Account"}
						</button>
					</form>

					<p className="text-center text-sm text-slate-500 mt-6">
						Already have an account?{" "}
						<Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">Log in</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
