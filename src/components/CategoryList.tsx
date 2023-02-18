import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../shared/interfaces/category-list';
import configData from '../config.json';

import classes from './CategoryList.module.css';
interface Props {
	categories: Category[];
}

const CategoryList: React.FC<Props> = ({ categories }) => {
	// if (!categories) {
	// 	return <div>Loading...</div>;
	// }
	return (
		<>
			<div className={classes.gallery__grid}>
				{categories?.map((category) => (
					<div
						key={category.id}
						className={classes[`gallery__${category.url_key}`]}>
						<Link
							to={`/category/${category.url_key}`}
							className={classes['gallery__link']}>
							<div className={classes['gallery__item']}>
								<img
									src={`${configData.IMAGES}/product-categories/${category.image}`}
								/>
								<span className={`${classes['gallery__card']}`}>
									{category.title}
								</span>
							</div>
						</Link>
					</div>
				))}
			</div>
		</>
	);
};

export default CategoryList;
