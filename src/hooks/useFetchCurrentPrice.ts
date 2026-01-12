/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";

const useFetchCurrentPrice = (isEnabled: boolean) => {
	return useQuery({
		queryKey: ["fetch-price"], // include address
		queryFn: () => fetchCurrentPrice(),
		enabled: isEnabled, // fetch only if address exists
		refetchInterval: 5000, // 5 seconds
		refetchIntervalInBackground: true, // keep polling even when tab inactive
		staleTime: 0, // always considered stale
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};

const fetchCurrentPrice = async () => {
	const response = await fetch("https://api.hyperliquid.xyz/info", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			type: "allMids",
		}),
	});
	if (!response.ok) throw new Error("Failed to fetch current balance data");
	const data = await response.json();
	return data;
};

export default useFetchCurrentPrice;
