/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";

const useFetchLighterCurrentPrice = (marketId: number, isEnabled: boolean) => {
	return useQuery({
		queryKey: ["fetch-lighter-price"], // include address
		queryFn: () => fetchLighterCurrentPrice(marketId),
		enabled: isEnabled, // fetch only if address exists
		refetchInterval: 5000, // 5 seconds
		refetchIntervalInBackground: true, // keep polling even when tab inactive
		staleTime: 0, // always considered stale
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};

const fetchLighterCurrentPrice = async (marketId: number) => {
	const response = await fetch(
		`https://mainnet.zklighter.elliot.ai/api/v1/orderBookDetails?market_id=${marketId}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) throw new Error("Failed to fetch current balance data");
	const data = await response.json();
	return data;
};

export default useFetchLighterCurrentPrice;
