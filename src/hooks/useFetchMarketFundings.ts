/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMarketFundings } from "../api/positions";

const useFetchMarketFundings = () => {
	return useQuery({
		queryKey: ["marketFundings"],
		queryFn: () => fetchMarketFundings(),
		staleTime: 60 * 60 * 1000, // 60 minutes
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};

export default useFetchMarketFundings;
