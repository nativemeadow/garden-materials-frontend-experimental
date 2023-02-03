import React from 'react';
import { useLoaderData, json, useParams } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { Category } from '../shared/interfaces/category-list';

const categoriesQuery = (urlKey: string) => ({
	queryKey: ['categories'],
	queryFn: async () => {
		const response = await httpFetch<Category[]>(
			`${configData.BACKEND_URL}/categories/${urlKey}`
		);
		if (!response) {
			throw new Response('Could not fetch events!');
		} else {
			return response as Category[];
		}
	},
});

interface Props {
	request: any;
	params: {
		urlKey: string;
	};
}

export const loader =
	(queryClient: any) =>
	async ({ request, params }: Props) => {
		const query = categoriesQuery(params.urlKey);
		return (
			queryClient.getQueryData() ??
			((await queryClient.fetchQuery(query)) as Category[])
		);
	};

const CategoryPage = () => {
	const { urlKey } = useParams<{ urlKey: string }>();
	const initialData = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof loader>>
	>;
	let CategoryItems;
	if (urlKey) {
		const { data } = useQuery<Category[]>({
			...categoriesQuery(urlKey),
			initialData,
		});
		CategoryItems = data;
	}

	return <div>Category Page</div>;
};

export default CategoryPage;
