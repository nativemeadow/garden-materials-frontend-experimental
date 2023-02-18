import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { Product, Pricing } from '../shared/interfaces/product';
import { parser } from '../shared/util/html-parse';
import parse from 'html-react-parser';
import ProductBuilder from '../components/ProductBuilder';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import BeardCrumb from '../components/BeardCrumb';
import ProductDetail from '../components/ProductDetail/ProductDetail';
import { selectListOptions } from '../components/ProductDetail/SharedTypes';

import classes from './ProductDetail.module.css';

const productQuery = (categoryUrlKey: string, urlKey: string) => ({
	queryKey: ['products', categoryUrlKey, urlKey],
	queryFn: async () => {
		const response = await httpFetch<Product[]>(
			`${configData.BACKEND_URL}/products/${categoryUrlKey}/${urlKey}`
		);
		if (!response) {
			throw new Response('Could not fetch products!');
		} else {
			return response;
		}
	},
});

interface loaderProps {
	request: Request;
	params: {
		categoryUrlKey: string;
		urlKey: string;
	};
}

export const loader = (queryClient: QueryClient) => async (params: any) => {
	const { categoryUrlKey, urlKey } = params.params;
	const query = productQuery(categoryUrlKey, urlKey);
	console.log('loader:', query, 'params', params);
	return (
		queryClient.getQueryData(query.queryKey) ??
		(await queryClient.fetchQuery(query))
	);
};

const ProductDetailPage: React.FC = () => {
	const { urlKey } = useParams<{ urlKey: string }>();
	const { categoryUrlKey } = useParams<{ categoryUrlKey: string }>();
	const { sku } = useParams<{ sku: string }>();

	const selectedPriceRef = useRef(0);
	const selectedUnitRef = useRef('');
	const productImageRef = useRef('');
	const coverageValueRef = useRef(0);

	let productData;
	let loadingItems = false;
	let hasError = false;
	let errorDetail = null;
	if (urlKey) {
		const { isLoading, isError, data, error } = useQuery<Product, Error>(
			productQuery(categoryUrlKey!, urlKey).queryKey
		);

		productData = data;
		loadingItems = isLoading;
		hasError = isError;
		errorDetail = error;
	}
	let currentProduct;
	if (productData) {
		currentProduct = ProductBuilder(productData);
	}

	return (
		<>
			<BeardCrumb urlKey={categoryUrlKey!} />
			<div className={classes['products-detail']}>
				{loadingItems && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				{hasError && (
					<div className='error'>{errorDetail?.message}</div>
				)}

				{currentProduct && (
					<ProductDetail product={currentProduct as Product} />
				)}
			</div>
		</>
	);
};

export default ProductDetailPage;
