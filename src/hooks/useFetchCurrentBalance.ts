/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentBalance } from "../api/positions";

const useFetchCurrentBalance = (address: string) => {
	return useQuery({
		queryKey: ["current-balance", address], // include address
		queryFn: () => fetchCurrentBalance(address as string),
		enabled: !!address, // fetch only if address exists
		refetchInterval: 5000, // 5 seconds
		refetchIntervalInBackground: true, // keep polling even when tab inactive
		staleTime: 0, // always considered stale
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};

export default useFetchCurrentBalance;
