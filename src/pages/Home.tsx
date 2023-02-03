import React from 'react';
import { useLoaderData, json } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { Category } from '../shared/interfaces/category-list';
import CategoryList from '../components/CategoryList';

const categoriesQuery = () => ({
	queryKey: ['categories'],
	queryFn: async () => {
		const response: Category[] = await httpFetch<Category[]>(
			`${configData.BACKEND_URL}/categories`
		);
		if (!response) {
			throw new Response('Could not fetch events!');
		} else {
			return response as Category[];
		}
	},
});

export const loader = (queryClient: any) => async () => {
	const query = categoriesQuery();
	return (
		queryClient.getQueryData() ??
		((await queryClient.fetchQuery(query)) as Category[])
	);
};

const HomePage: React.FC = () => {
	const initialData = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof loader>>
	>;
	const { data: CategoryItems } = useQuery<Category[]>({
		...categoriesQuery(),
		initialData,
	});

	return <CategoryList categories={CategoryItems as Category[]} />;
};

export default HomePage;
