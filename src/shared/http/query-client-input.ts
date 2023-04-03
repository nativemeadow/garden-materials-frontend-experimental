import { json } from 'react-router-dom';
import httpFetch from './http-fetch';

export const queryClientInput = <T>(
	queryId: string[],
	inputData: T | null,
	serverUrl: string,
	apiPath: string,
	method: string = 'GET',
	headers: {}
) => ({
	queryKey: queryId,
	queryFn: async () => {
		const inputDataParm = inputData ? JSON.stringify(inputData) : null;
		const response = await httpFetch<T>(
			`${serverUrl}${apiPath}`,
			method,
			inputDataParm,
			headers
		);
		console.log('customer detail response', response);
		if (response) {
			return response;
		}
		throw json({
			message: `Could not fetch data from ${serverUrl}${apiPath}`,
		});
	},
});
