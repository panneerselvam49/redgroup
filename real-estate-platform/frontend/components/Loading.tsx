export default function Loading({ text = "Loading..." }: { text?: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 gap-4">
			<div
				className="w-10 h-10 border-stone-200 border-t-amber-500 rounded-full animate-spin"
				style={{ borderWidth: 3, borderStyle: "solid" }}
			/>
			<p className="text-slate-500 text-sm">{text}</p>
		</div>
	);
}
