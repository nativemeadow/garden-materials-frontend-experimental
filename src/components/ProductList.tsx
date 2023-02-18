import React from 'react';
import { Product } from '../shared/interfaces/product';

import ProductCard from './ProductCard';

import classes from './ProductList.module.css';

interface Props {
	products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
	return (
		<>
			<div className={classes['products__grid']}>
				{products?.map((item, index) => {
					return (
						<div key={index} className={classes['card-width']}>
							<ProductCard product={item} />
						</div>
					);
				})}
			</div>
		</>
	);
};

export default ProductList;
