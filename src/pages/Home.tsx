import React from 'react';
import { useLoaderData, json } from 'react-router-dom';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { Category } from '../shared/interfaces/category-list';

const categoriesQuery = async () => ({
	queryKey: 'categories',
	queryFn: async () => {
		const response = await httpFetch<Category[]>(
			`${configData.BACKEND_URL}/categories`
		);
		if (!response) {
			throw new Error('Could not fetch events!');
		} else {
			return response;
		}
	},
});

export const loader = async () => {
	try {
		const response = await httpFetch<Category[]>(
			`${configData.BACKEND_URL}/categories`
		);
		if (!response) {
			throw json({ message: 'Could not fetch events!' }, { status: 500 });
		} else {
			return response;
		}
	} catch (error: any) {
		throw json({ message: error }, { status: 500 });
	}
};

const HomePage = () => {
	const categories = useLoaderData() as Category[];
	return (
		<ul>
			{categories.map((category) => (
				<li key={category.id}>{category.title}</li>
			))}
		</ul>
	);
};

export default HomePage;
