import React from 'react';
import { useLoaderData, json } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { Category } from '../shared/interfaces/category-list';
import CategoryList from '../components/CategoryList';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import classes from './Home.module.css';

const categoriesQuery = () => ({
	queryKey: ['categories'],
	queryFn: async () => {
		const response: Category[] = await httpFetch<Category[]>(
			`${configData.BACKEND_URL}/categories`
		);
		if (!response) {
			throw json({ message: 'Could not fetch categories!' });
		} else {
			return response;
		}
	},
});

export const loader = (queryClient: QueryClient) => async () => {
	const query = categoriesQuery();
	return (
		queryClient.getQueryData(query.queryKey) ??
		(await queryClient.fetchQuery(query))
	);
};

const HomePage: React.FC = () => {
	const initialData = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof loader>>
	>;
	const {
		isLoading,
		isError,
		data: CategoryItems,
		error,
	} = useQuery<Category[], Error>(categoriesQuery().queryKey, {
		...categoriesQuery(),
		// initialData,
	});

	return (
		<>
			<div className={classes.gallery}>
				{isLoading && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				{isError && <div className='error'>{error?.message}</div>}
				<h1 className='page_title'>Browse Our Landscaping Materials</h1>
				<CategoryList categories={CategoryItems as Category[]} />
			</div>
		</>
	);
};

export default HomePage;
