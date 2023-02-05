import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../shared/interfaces/category-list';

interface Props {
	categories: Category[];
}

const CategoryDetail: React.FC<Props> = ({ categories }) => {
	return (
		<>
			<h1>{categories[0].title}</h1>
			<ul>
				{categories?.slice(1).map((category) => (
					<li key={category.url_key}>
						<Link to={`/category/${category.url_key}`}>
							{category.title}
						</Link>
					</li>
				))}
			</ul>
		</>
	);
};

export default CategoryDetail;
