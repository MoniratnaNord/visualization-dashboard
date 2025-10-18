import { useQuery } from "@tanstack/react-query";
import { fetchTradeDetails } from "../api/positions";

const useFetchTradeDetails = (address: string, enabled: boolean) => {
	return useQuery({
		queryKey: ["fetch-lighter-trades"],
		queryFn: () => fetchTradeDetails(address),
		// staleTime: 60 * 60 * 1000, // 60 minutes
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: false,
		enabled: enabled,
	});
};

export default useFetchTradeDetails;
