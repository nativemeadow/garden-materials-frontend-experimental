import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parser } from '../../shared/util/html-parse';
import parse from 'html-react-parser';
import useStore from '../../zustand/store';
import { Product, Pricing } from '../../shared/interfaces/product';
import configData from '../../config.json';
import { useWindowSize } from '../../shared/hooks/widowSize-hook';
import { selectListOptions } from './SharedTypes';

import DetailZoom from './DetailZoom';
import ProductPriceLIst from './ProductForm';
import ProductThumbs from './ProductThumbs';

import classes from './ProductDetail.module.css';
import './ProductDetail.css';

interface Props {
	product: Product;
	sku?: string;
	// selectListOptions: selectListOptions[];
}

const productLabelMessage = 'Please Select Product Options';

const ProductDetail: React.FC<Props> = ({ product, sku }) => {
	const [selectList, setSelectList] = useState<selectListOptions[]>([]);

	const [productSize, setProductSize] = useState('');
	const [productSku, setProductSku] = useState('');
	const [selectedValue, setSelectedValue] = useState(String);
	const [productSizeMessage, setProductSizeMessage] =
		useState<string>(productLabelMessage);

	const [productQty, setProductQty] = useState<number>(1);
	const [productImage, setProductImage] = useState('');
	const [selectedThumb, setSelectedThumb] = useState<string>();
	const [productThumbs, setProductThumbs] = useState<Pricing[] | undefined>(
		[]
	);

	const [showCalculator, setShowCalculator] = useState(false);
	const [showAddToCart, setShowAddToCart] = useState(false);

	const windowSize = useWindowSize();

	const selectedPriceRef = useRef(0);
	const selectedUnitRef = useRef('');
	const productImageRef = useRef('');
	const coverageValueRef = useRef(0);

	const {
		extendedValue,
		extendedRules,
		removeExtendedValue,
		removeExtendedRule,
	} = useStore();

	const navigate = useNavigate();

	const selectProductBySku = useCallback(
		(productOptions: selectListOptions[]) => {
			if (sku) {
				for (const item of productOptions) {
					if (item.sku === sku) {
						setSelectedThumb(item.image);
						setProductSku(item.sku);
						updateSelectedUnit(item.units);
						if (item.image && item.image.length > 0) {
							setProductImage(item.image);
						}
					}
				}
			}
		},
		[sku]
	);

	useEffect(() => {
		let pricing: Pricing[];
		pricing = product.pricing;
		setProductImage(product.image);
		pricing.forEach((price) => {
			coverageValueRef.current = price.coverage_value;
		});
		productImageRef.current = product?.image;
		let productOptions: selectListOptions[] = [];
		productOptions = product.pricing.map((item) => {
			return {
				sku: item.sku,
				units: item.units,
				price: item.price,
				description: item.description,
				image: item.image,
				coverage: item.coverage,
				coverage_value: item.coverage_value,
				online_minimum: item.online_minimum,
			};
		});

		selectProductBySku(productOptions);

		// only one unit price
		if (product && product.pricing.length === 1) {
			setProductSize(product.pricing[0].units);
		}

		productImageRef.current = product?.image;

		// get thumbnail images if any
		const thumbs = product.pricing.filter((price) => {
			return price.image && price.image.length > 0;
		});
		setProductThumbs(thumbs);

		if (product.pricing.length === 1) {
			setProductSizeMessage(
				product?.pricing[0].title +
					`<span className=${classes['products-detail-pricing-usd-selected']}>$` +
					product?.pricing[0].price.toFixed(2) +
					'<span>'
			);
		}

		setSelectList(productOptions);
	}, [product, selectProductBySku]);

	const imageHandler = () => {
		if (windowSize.width! > 768 && product?.imageLensSize) {
			return (
				<DetailZoom
					productImage={productImage}
					defaultImage={'default_image.png'}
					imagePath={`${configData.IMAGES}/products/`}
					imageLensSize={product?.imageLensSize}
					alt={product?.title !== undefined ? product?.title : ''}
				/>
			);
		}
		return (
			<img
				src={`${configData.IMAGES}/products/${productImage}`}
				alt={product?.title !== undefined ? product?.title : ''}
			/>
		);
	};

	const updateProductPrice = (price: number) => {
		selectedPriceRef.current = price;
	};

	const productUnit = (units: string) => {
		let priceTitle = productLabelMessage;
		setProductSize(units);

		product?.pricing.forEach((price) => {
			if (price.description + price.units === units) {
				selectedPriceRef.current = price.price;
				return (priceTitle =
					price.title +
					`<span className=${classes['products-detail-pricing-usd-selected']}>$` +
					price.price.toFixed(2) +
					'</span>');
			}
		});
		return priceTitle;
	};

	const filterPricing = () => {
		const filterPrices =
			product &&
			product.pricing.filter((value, index, array) => {
				return (
					index === array.findIndex((t) => t.price === value.price)
				);
			});

		return filterPrices?.map((price, key) => {
			return (
				<li key={key} id={`price-${price.key}`}>
					<span className={classes['products-detail-pricing-usd']}>
						${price.price.toFixed(2)}
					</span>
					&nbsp;/
					{parser(price.units)}
				</li>
			);
		});
	};

	const productSelectHandler = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selected = event.target.value;
		setSelectedValue(selected);
		const title = productUnit(selected);
		// set the message describing the product size and price
		setProductSizeMessage(title);
		// if there is thumb highlighted in the drop down select list.
		if (productThumbs) {
			selectList.forEach((item) => {
				if (item.description + item.units === selected) {
					setSelectedThumb(item.image);
					setProductSku(item.sku);
					updateSelectedUnit(item.units);
					if (item.image && item.image.length > 0) {
						setProductImage(item.image);
					}
				}
			});
		}
	};

	const addToCartHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('add to cart');
	};

	/**
	 * Used here and in product-thumbs component to set the value of
	 * the selectedUnit ref variable.
	 * @param unit
	 */
	const updateSelectedUnit = (unit: string) => {
		selectedUnitRef.current = unit;
	};

	const updateThumbsImage = (image: string) => {
		if (image && image.length > 0) {
			productImageRef.current = image;
			setProductImage(image);
		}
	};

	const openCalculatorHandler = () => {
		setShowCalculator(true);
	};

	const closeCalculatorHandler = () => {
		setShowCalculator(false);
	};

	const closeAddToCartHandler = () => {
		setShowAddToCart(false);
	};

	const viewShoppingCartHandler = () => {
		setShowAddToCart(false);
		navigate('/shopping-cart');
	};

	const openAddToCartHandler = () => {
		setShowAddToCart(true);
	};

	return (
		<>
			<div className={classes['product-detail-container']}>
				<div className={classes['product-detail__image']}>
					<div className={classes['product-detail__image--wrapper']}>
						{productImage && imageHandler()}
					</div>
					<ProductThumbs
						productThumbs={productThumbs}
						selectedThumb={selectedThumb}
						setSelectedThumb={setSelectedThumb}
						setProductImage={setProductImage}
						setProductSku={setProductSku}
						setSelectedValue={setSelectedValue}
						productUnit={productUnit}
						setProductOptions={setProductSizeMessage}
						updateSelectedUnit={updateSelectedUnit}
						updateThumbsImage={updateThumbsImage}
					/>
				</div>
				<div className={classes['product-detail']}>
					<h1>
						{product?.title !== undefined
							? parser(product?.title)
							: ''}
					</h1>
					<ul className={classes['products-detail-pricing']}>
						{filterPricing()}
					</ul>
					<ProductPriceLIst
						products={product}
						productSize={productSize}
						productQty={productQty}
						selectedValue={selectedValue}
						selectList={selectList}
						productThumbs={productThumbs}
						productOptions={productSizeMessage}
						setProductQty={setProductQty}
						addToCartHandler={addToCartHandler}
						productSelectHandler={productSelectHandler}
					/>
					<div className={classes['product-detail__description']}>
						{product?.description !== undefined
							? parse(product?.description)
							: ''}
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetail;
