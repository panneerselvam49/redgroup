"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, setToken, setStoredUser } from "@/lib/api";

export default function LoginPage() {
	const router = useRouter();
	const [form, setForm] = useState({ email: "", password: "" });
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
			const res = await authApi.login(form);
			setToken(res.data.token);
			setStoredUser(res.data.user);
			window.dispatchEvent(new Event("storage"));
			router.push("/properties");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
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
						<h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
						<p className="text-slate-500 text-sm mt-1">Sign in to your EstateHub account</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
							<input id="email" name="email" type="email" required autoComplete="email"
								placeholder="john@example.com" value={form.email} onChange={handleChange} className={inputClass} />
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
							<input id="password" name="password" type="password" required autoComplete="current-password"
								placeholder="Your password" value={form.password} onChange={handleChange} className={inputClass} />
						</div>

						<button
							id="login-submit-btn"
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition-colors text-sm mt-2"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					<p className="text-center text-sm text-slate-500 mt-6">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium">Register</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
