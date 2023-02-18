import React from 'react';
import { useLoaderData, json, useParams } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import parse from 'html-react-parser';
import { Category } from '../shared/interfaces/category-list';
import CategoryDetail from '../components/CategoryDetail';
import Products from './Products';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import BeardCrumb from '../components/BeardCrumb';

import classes from './Category.module.css';

const categoriesQuery = (urlKey: string) => ({
	queryKey: ['category', urlKey],
	queryFn: async () => {
		const response = await httpFetch<Category[]>(
			`${configData.BACKEND_URL}/categories/${urlKey}`
		);
		if (!response) {
			throw json({ message: 'Could not fetch category detail!' });
		} else {
			return response;
		}
	},
});

interface Props {
	request: Request;
	params: {
		urlKey: string;
	};
}

export const loader = (queryClient: QueryClient) => async (props: any) => {
	const { urlKey } = props.params;
	const query = categoriesQuery(urlKey);
	console.log('loader query', query, 'props', props);
	return (
		queryClient.getQueryData(query.queryKey) ??
		(await queryClient.fetchQuery(query))
	);
};

const CategoryPage = () => {
	console.log('CategoryPage');
	const { urlKey } = useParams<{ urlKey: string }>();
	const initialData = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof loader>>
	>;
	let CategoryItems;
	let loadingItems = false;
	let hasError = false;
	let errorDetail = null;
	if (urlKey) {
		const { isLoading, isError, data, error } = useQuery<Category[], Error>(
			{
				...categoriesQuery(urlKey),
			}
		);
		CategoryItems = data;
		loadingItems = isLoading;
		hasError = isError;
		errorDetail = error;
	}

	return (
		<>
			<BeardCrumb urlKey={urlKey!} />
			<div className={classes['category-detail']}>
				{loadingItems && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				<h1
					className={`${classes['category-detail__heading']} ${classes['category-detail__title']}`}>
					{CategoryItems && CategoryItems[0].title}
				</h1>
				{hasError && (
					<div className='error'>{errorDetail?.message}</div>
				)}
				<div className={classes['category-detail__description']}>
					{CategoryItems &&
						CategoryItems[0]?.description?.length &&
						parse(CategoryItems && CategoryItems[0]?.description)}
				</div>
				<CategoryDetail categories={CategoryItems as Category[]} />

				<Products urlKey={urlKey!} />
			</div>
		</>
	);
};

export default CategoryPage;
