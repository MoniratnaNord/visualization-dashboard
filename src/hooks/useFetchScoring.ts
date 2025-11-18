/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchScoring } from "../api/positions";

const useFetchScoring = (selectedMarket: string) => {
	return useQuery({
		queryKey: ["scoring"],
		queryFn: () => fetchScoring(selectedMarket),
		enabled: !!selectedMarket,
	});
};

export default useFetchScoring;
