import React from 'react';
import { Link } from 'react-router-dom';

const ShoppingCart: React.FC = () => {
	return (
		<div>
			<h1>Shopping Cart Detail</h1>
			<Link to='/checkout'>Checkout</Link>
		</div>
	);
};

export default ShoppingCart;
