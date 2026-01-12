/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";

const useFetchLighterMarkets = (isEnabled: boolean) => {
	return useQuery({
		queryKey: ["lighter-market"], // include address
		queryFn: () => fetchMarkets(),
		enabled: isEnabled, // fetch only if address exists
		// refetchInterval: 5000, // 5 seconds
		refetchIntervalInBackground: true, // keep polling even when tab inactive
		staleTime: 0, // always considered stale
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};

const fetchMarkets = async () => {
	const response = await fetch("https://explorer.elliot.ai/api/markets", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) throw new Error("Failed to fetch current balance data");
	const data = await response.json();
	return data;
};

export default useFetchLighterMarkets;
