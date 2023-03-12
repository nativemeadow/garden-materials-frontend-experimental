import React from 'react';

import ProductCard from '../ProductCard';
import { Product } from '../../shared/interfaces/product';

import classes from './results.module.css';

interface Props {
	products: Product[];
}

const Results: React.FC<Props> = ({ products }) => {
	return (
		<div className={'flex gap-4'}>
			<div className='w-1/4 border-2 rounded-lg border-gray-300 border-solid'></div>
			<div className={classes['products__group']}>
				{products?.map((item, index) => {
					return (
						<div key={index} className={classes['card-width']}>
							<ProductCard product={item} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Results;
