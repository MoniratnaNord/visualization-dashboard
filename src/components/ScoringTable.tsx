import { useEffect, useRef, useState } from "react";
import {
	fetchHlTrades,
	fetchLighterTrades,
	fetchMarketFundings,
	fetchScoring,
} from "../api/positions";
import { useParams } from "react-router-dom";
import useFetchScoring from "../hooks/useFetchScoring";

export function ScoringTable({
	title,
	selectedMarket,
}: {
	title: string;
	selectedMarket: string;
}) {
	const params = useParams();
	// console.log("checking params", params);
	const [error, setError] = useState("");
	const [address, setAddress] = useState("");
	const formatTimestamp = (ts: number) => new Date(ts).toLocaleString();
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
	type score = {
		market: string;
		score: number;
		hl_rate: number;
		lighter_rate: number;
		data_points: number;
		components: {
			differential: number;
			volatility: number;
			trend: number;
		};
		current_differential: number;
		confidence: number;
		expected_pnl_rate: number;
	};

	const [data, setData] = useState<score | null>(null);
	const [tableData, setTableData] = useState<any[]>([]);
	// const [loading, setLoading] = useState(true);
	// const handleFetch = async () => {
	// 	try {
	// 		// setLoading(true);

	// 		const response = await fetchScoring(selectedMarket);
	// 		setData(response.data);
	// 	} catch (e: any) {
	// 		setError(e.message || "Error fetching positions");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const lastFetchedMarket = useRef("");

	// useEffect(() => {
	// 	if (!selectedMarket) return;

	// 	// Prevent duplicate calls for same market
	// 	if (lastFetchedMarket.current === selectedMarket) return;

	// 	lastFetchedMarket.current = selectedMarket;
	// 	handleFetch();
	// }, [selectedMarket]);
	const {
		data: scoringData,
		isLoading: scoringLoading,
		refetch,
	} = useFetchScoring(selectedMarket);
	useEffect(() => {
		if (scoringData) {
			setData(scoringData.data);
			// setLoading(false);
		}
	}, [scoringData]);
	useEffect(() => {
		refetch();
	}, [selectedMarket]);
	return (
		<section className="mb-10">
			<h2 className="text-xl font-semibold mt-10 mb-3 text-blue-400">
				{title}
			</h2>
			{scoringLoading ? (
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
					{data === null ? (
						<p className="text-gray-500">No Trades data found.</p>
					) : (
						<>
							<div className="overflow-x-auto overflow-y-auto max-h-[400px]">
								<table className="w-full">
									<thead className="bg-slate-900/50 sticky top-0">
										<tr className="bg-slate-900/50 text-left text-slate-400 text-sm">
											<th className="px-4 py-3 font-medium">Market</th>
											<th className="px-4 py-3 font-medium">Score</th>
											<th className="px-4 py-3 font-medium">
												Current Differential
											</th>
											<th className="px-4 py-3 font-medium">
												Expected PNL Rate
											</th>
											<th className="px-4 py-3 font-medium">Data points</th>

											<th className="px-4 py-3 font-medium">Differential</th>
											<th className="px-4 py-3 font-medium">Volatility</th>
											<th className="px-4 py-3 font-medium">Trend</th>
										</tr>
									</thead>
									<tbody className="text-slate-200">
										{/* {tableData.map((f: any, i) => ( */}
										<tr
											// key={i}
											className="border-t border-slate-700/50 hover:bg-slate-700/30"
										>
											<td className="px-4 py-3 font-medium">{data.market}</td>
											<td className="px-4 py-3">
												<span
													className={
														data.score >= 0 ? "text-green-400" : "text-red-400"
													}
												>
													{data.score.toFixed(2)}
												</span>
											</td>
											<td className="px-4 py-3 text-green-400">
												{Number(data.current_differential).toFixed(6)}
											</td>
											<td className="px-4 py-3">
												<span
													className={
														Number(data.expected_pnl_rate) >= 0
															? "text-green-400"
															: "text-red-400"
													}
												>
													{Number(data.expected_pnl_rate).toFixed(5)}
												</span>
											</td>
											<td className="px-4 py-3 text-green-400">
												{Number(data.data_points).toFixed(0)}
											</td>
											<td className="px-4 py-3 text-green-400">
												{Number(data.components.differential).toFixed(5)}
											</td>
											<td className="px-4 py-3 text-green-400">
												{Number(data.components.volatility).toFixed(5)}
											</td>
											<td className="px-4 py-3 text-green-400">
												{Number(data.components.trend).toFixed(5)}
											</td>
										</tr>
										{/* ))} */}
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
