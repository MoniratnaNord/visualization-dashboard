import { useQuery } from "@tanstack/react-query";
import { fetchTradeDetails } from "../api/positions";

const useFetchTradeDetails = (address: string, enabled: boolean) => {
	return useQuery({
		queryKey: ["fetch-lighter-trades"],
		queryFn: () =>
			fetchTradeDetails(
				address,
				address.toLowerCase() ===
					"0xA2a95178FFED95ce9a2278bcA9bB5bef8C0DC95C".toLowerCase() ||
					address.toLowerCase() ===
						"0x85290Ee672292528376adc10ef1Ff6f4Dbb29bDF".toLowerCase()
			),
		// staleTime: 60 * 60 * 1000, // 60 minutes
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: false,
		enabled: enabled,
	});
};

export default useFetchTradeDetails;
