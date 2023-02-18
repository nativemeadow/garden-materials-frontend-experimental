import React from 'react';
import { useLoaderData, json, useParams } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { Product } from '../shared/interfaces/product';
import ProductList from '../components/ProductList';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import classes from './Products.module.css';

const productsQuery = (urlKey: string) => ({
	queryKey: ['products', urlKey],
	queryFn: async () => {
		const response = await httpFetch<Product[]>(
			`${configData.BACKEND_URL}/categories/product-pricing/${urlKey}`
		);
		if (!response) {
			throw new Response('Could not fetch products!');
		} else {
			return response;
		}
	},
});

interface loaderProps {
	request: any;
	params: {
		urlKey: string;
	};
}

export const loader =
	(queryClient: QueryClient) =>
	async ({ request, params }: loaderProps) => {
		const query = productsQuery(params.urlKey);
		return (
			queryClient.getQueryData(query.queryKey) ??
			(await queryClient.fetchQuery(query))
		);
	};

interface Props {
	urlKey: string;
}

const ProductsPage: React.FC<Props> = ({ urlKey }: Props) => {
	let productItems;
	let loadingItems = false;
	let hasError = false;
	let errorDetail = null;
	if (urlKey) {
		const { isLoading, isError, data, error } = useQuery<Product[], Error>(
			productsQuery(urlKey).queryKey,
			{
				...productsQuery(urlKey),
			}
		);

		productItems = data;
		loadingItems = isLoading;
		hasError = isError;
		errorDetail = error;
	}

	return (
		<>
			<div className={classes['products-detail']}>
				{loadingItems && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				{hasError && (
					<div className='error'>{errorDetail?.message}</div>
				)}
				{productItems && productItems?.length !== 0 && (
					<ProductList products={productItems} />
				)}
			</div>
		</>
	);
};

export default ProductsPage;
