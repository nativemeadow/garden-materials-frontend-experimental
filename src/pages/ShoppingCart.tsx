import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartDetail from '../components/ShoppingCart';

const ShoppingCart: React.FC = () => {
	return (
		<div>
			<h1>Shopping Cart</h1>
			<ShoppingCartDetail />
		</div>
	);
};

export default ShoppingCart;
