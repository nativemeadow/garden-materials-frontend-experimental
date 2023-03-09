import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { persist, StateStorage } from 'zustand/middleware';
import { Items } from '../../shared/interfaces/items';
import ShoppingCartItems from './ShoppingCartItems';
import useShoppingCart from '../../zustand/shoppingCart';

import configData from '../../config.json';

import { Link } from 'react-router-dom';

import './ShoppingCart.css';
import classes from './ShoppingCart.module.css';

const ShoppingCart: React.FC = () => {
	const { updateItem, removeItem } = useShoppingCart();
	const shoppingCart = useShoppingCart((state) => state);

	useEffect(() => {
		async function GetCartData() {
			if (useShoppingCart.persist.hasHydrated()) {
				console.log('already hydrated: ', useShoppingCart.getState());
				return useShoppingCart.getState();
			}

			await useShoppingCart.persist.rehydrate();
			console.log('rehydrated: ', useShoppingCart.getState());
		}

		GetCartData();
	}, []);

	const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const itemId = parseInt(event.currentTarget.dataset['itemId']!, 10);
		const newQty = event.target.value;

		console.log('Update this cart item', itemId, ' Quantity to', newQty);

		const newQuantity = parseFloat(newQty);
		updateItem(itemId, newQuantity);
	};

	const removeHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const itemId = parseInt(event.currentTarget.dataset['itemId']!, 10);
		console.log('Remove this cart item', itemId);
		removeItem(itemId);
	};

	const checkoutOptionHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.preventDefault();
	};

	const checkoutHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	const onPurchaseOrderBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		event.preventDefault();
		const purchaseOrder = event.target.value;
	};

	const setTheStep = (unit: string | undefined): string => {
		const unitsArray = ['lbs', 'ton', 'tons', 'yds', 'yds', 'ft', 'cu ft'];
		if (!unit) {
			return '';
		}
		return unitsArray.includes(unit) ? '0.5' : '1';
	};

	return (
		<>
			<div id={classes['shopping-cart']}>
				<h3>Shopping Cart</h3>
				<div className={classes['shopping-cart']}>
					<div className={classes['shopping-cart__grid']}>
						<form name='checkout' onSubmit={checkoutHandler}>
							<ShoppingCartItems
								items={shoppingCart.Items}
								setTheStep={setTheStep}
								onQuantityChange={onQuantityChange}
								removeHandler={removeHandler}
							/>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ShoppingCart;
