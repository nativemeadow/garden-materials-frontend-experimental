import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';
import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import { ProductArrayBuilder } from '../components/ProductBuilder';
import { Product } from '../shared/interfaces/product';
import Results from '../components/search/results';

import classes from './Search.module.css';

const searchQuery = (searchTerm: string) => ({
	queryKey: ['search', searchTerm],
	queryFn: async () => {
		const response = await httpFetch<Product[]>(
			`${configData.BACKEND_URL}/search/products`,
			'POST',
			JSON.stringify({ search: searchTerm }),
			{ 'Content-Type': 'application/json' },
			'omit'
		);
		if (!response) {
			throw new Response('Could not search products!');
		} else {
			return response;
		}
	},
});

export const loader = (queryClient: QueryClient) => async (params: any) => {
	const { searchTerm } = params.params;
	const query = searchQuery(searchTerm);
	return (
		queryClient.getQueryData(query.queryKey) ??
		(await queryClient.fetchQuery(query))
	);
};

interface Props {
	searchTerm: string;
}

const SearchPage: React.FC = () => {
	const { searchTerm } = useParams<{ searchTerm: string }>();
	let searchResults;
	let loadingResults = false;
	let hasError = false;
	let errorDetail = null;
	if (searchTerm) {
		const { isLoading, isError, data, error } = useQuery<Product[], Error>(
			searchQuery(searchTerm).queryKey
		);

		searchResults = ProductArrayBuilder(data as Product[]);
		loadingResults = isLoading;
		hasError = isError;
		errorDetail = error;
	}

	return (
		<div>
			<>
				<div className={classes['search-detail']}>
					{loadingResults && (
						<div className='center'>
							<LoadingSpinner asOverlay />
						</div>
					)}
					{hasError && (
						<div className='error'>{errorDetail?.message}</div>
					)}
					<h1>Search Results</h1>
					<div className={classes['terms']}>
						<span>Search term:</span> {searchTerm}
					</div>
					{searchResults && searchResults?.length !== 0 && (
						<Results products={searchResults} />
					)}
				</div>
			</>
		</div>
	);
};

export default SearchPage;
