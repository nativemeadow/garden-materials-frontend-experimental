import React from 'react';
import { Link } from 'react-router-dom';
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
				<li key={category.id}>
					<Link to={`/category/${category.url_key}`}>
						{category.title}
					</Link>
				</li>
			))}
		</ul>
	);
};

export default CategoryList;
