interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
	if (totalPages <= 1) return null;

	const pages: (number | "...")[] = [];
	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
	} else {
		pages.push(1);
		if (page > 4) pages.push("...");
		for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) pages.push(i);
		if (page < totalPages - 3) pages.push("...");
		pages.push(totalPages);
	}

	return (
		<div className="flex items-center justify-center gap-1 mt-8">
			<button
				id="pagination-prev"
				onClick={() => onPageChange(page - 1)}
				disabled={page === 1}
				className="px-3 py-2 text-sm rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				← Prev
			</button>

			{pages.map((p, i) =>
				p === "..." ? (
					<span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
				) : (
					<button
						key={p}
						id={`pagination-page-${p}`}
						onClick={() => onPageChange(p as number)}
						className={`w-9 h-9 text-sm rounded-lg border transition-colors ${p === page
								? "bg-amber-500 border-amber-500 text-white font-medium"
								: "border-stone-200 text-slate-600 hover:bg-stone-50"
							}`}
					>
						{p}
					</button>
				)
			)}

			<button
				id="pagination-next"
				onClick={() => onPageChange(page + 1)}
				disabled={page === totalPages}
				className="px-3 py-2 text-sm rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				Next →
			</button>
		</div>
	);
}
