import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../shared/interfaces/category-list';
import configData from '../config.json';

import classes from './CategoryDetail.module.css';

interface Props {
	categories: Category[];
}

const CategoryDetail: React.FC<Props> = ({ categories }) => {
	return (
		<>
			<div className={classes['category-grid']}>
				{categories?.slice(1).map((category) => (
					<div
						key={category.url_key}
						className={classes['image-container']}>
						<Link to={`/category/${category.url_key}`}>
							<img
								src={`${configData.IMAGES}/product-categories/${category.image}`}
								alt={category.title}
							/>
						</Link>
						<h2 className={classes['category-title']}>
							<Link to={`/category/${category.url_key}`}>
								{category.title}
							</Link>
						</h2>
					</div>
				))}
			</div>
		</>
	);
};

export default CategoryDetail;
