import { QueryClient, QueryKey } from '@tanstack/react-query';

export const invalidateQueries = (
	queryClient: QueryClient,
	queryKey: QueryKey
) => {
	queryClient.invalidateQueries(queryKey);
};
