import React from 'react';
import { Category } from '../shared/interfaces/category-list';

interface Props {
	categories: Category[];
}

const CategoryList: React.FC<Props> = ({ categories }) => {
	if (!categories) {
		return <div>Loading...</div>;
	}
	return (
		<ul>
			{categories?.map((category) => (
				<li key={category.id}>{category.title}</li>
			))}
		</ul>
	);
};

export default CategoryList;
