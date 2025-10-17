import { useEffect, useState } from "react";
import {
	fetchHlTrades,
	fetchLighterTrades,
	fetchMarketFundings,
} from "../api/positions";
import { useParams } from "react-router-dom";

export function PlatformTable({ title }: { title: string }) {
	const params = useParams();
	// console.log("checking params", params);
	const [error, setError] = useState("");
	const [address, setAddress] = useState("");
	const formatTimestamp = (ts: number) => new Date(ts).toLocaleString();
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
	type Trade = {
		market: string;
		side: string;
		amount: number | string;
		price: number | string;
		fee: number | string;
		buy_time: number;
		// position_size?: number | string;
	};

	const [data, setData] = useState<any[]>([]);
	const [tableData, setTableData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const handleFetch = async () => {
		setLoading(true);
		setLoading(true);
		try {
			const [response] = await Promise.all([fetchMarketFundings()]);
			setData(response.data || []);

			setLoading(false);
			// setTotalPages(Math.ceil((trades.data?.total || 0) / 10));
		} catch (e: any) {
			setError(e.message || "Error fetching positions");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (data.length > 0) {
			const marketMap: any = {};
			data.forEach(({ market, dex, annualized_rate }) => {
				if (!marketMap[market]) marketMap[market] = {};
				if (dex === "hyperliquid") marketMap[market].hl = annualized_rate;
				if (dex === "lighter") marketMap[market].lighter = annualized_rate;
			});

			const formatted = Object.keys(marketMap)
				.filter(
					(m) =>
						marketMap[m].hl !== undefined && marketMap[m].lighter !== undefined
				)
				.map((m) => {
					const hl = marketMap[m].hl;
					const lighter = marketMap[m].lighter;
					const diff = hl - lighter;
					const diffPercent = (diff / lighter) * 100;
					return {
						market: m,
						hl: hl.toFixed(4),
						lighter: lighter.toFixed(4),
						diff: diff.toFixed(4),
						diffPercent: diffPercent.toFixed(2),
					};
				});

			setTableData(formatted);
		}
	}, [data]);
	useEffect(() => {
		if (params.address) {
			setAddress(params.address);
		}
	}, [params.address]);
	useEffect(() => {
		handleFetch();
	}, []);
	return (
		<section className="mb-10">
			<h2 className="text-xl font-semibold mt-10 mb-3 text-blue-400">
				{title}
			</h2>
			{loading ? (
				<div className="flex items-center justify-center h-64">
					<div className="flex flex-col items-center">
						<svg
							className="animate-spin h-8 w-8 text-gray-400 mb-3"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
						<div className="text-gray-400">Loading...</div>
					</div>
				</div>
			) : (
				<>
					{data.length === 0 ? (
						<p className="text-gray-500">No Trades data found.</p>
					) : (
						<>
							<div className="overflow-x-auto overflow-y-auto max-h-[400px]">
								<table className="w-full">
									<thead className="bg-slate-900/50 sticky top-0">
										<tr className="bg-slate-900/50 text-left text-slate-400 text-sm">
											<th className="px-4 py-3 font-medium">Market</th>
											<th className="px-4 py-3 font-medium">HL Funding</th>
											<th className="px-4 py-3 font-medium">Lighter Funding</th>
											<th className="px-4 py-3 font-medium">HL - Lighter</th>
											{/* <th className="px-4 py-3 font-medium">HL - Lighter %</th> */}
										</tr>
									</thead>
									<tbody className="text-slate-200">
										{tableData.map((f: any, i) => (
											<tr
												key={i}
												className="border-t border-slate-700/50 hover:bg-slate-700/30"
											>
												<td className="px-4 py-3 font-medium">{f.market}</td>
												<td className="px-4 py-3">
													<span
														className={
															f.hl >= 0 ? "text-green-400" : "text-red-400"
														}
													>
														{f.hl}
													</span>
												</td>
												<td className="px-4 py-3 text-green-400">
													{Number(f.lighter).toFixed(5)}
												</td>
												<td className="px-4 py-3">
													<span
														className={
															Number(f.diff) >= 0
																? "text-green-400"
																: "text-red-400"
														}
													>
														{Number(f.diff).toFixed(5)}
													</span>
												</td>
												{/* <td className="px-4 py-3 text-green-400">
													<span
														className={
															Number(f.diffPercent) >= 0
																? "text-green-400"
																: "text-red-400"
														}
													>
														{Number(f.diffPercent).toFixed(2)}%
													</span>
												</td> */}
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{/* <div className="flex justify-center items-center mt-4 gap-2">
						<button
							className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
						>
							Prev
						</button>
						<span className="text-gray-300">
							Page {page} of {totalPages}
						</span>
						<button
							className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
						>
							Next
						</button>
					</div> */}
						</>
					)}
				</>
			)}
		</section>
	);
}
