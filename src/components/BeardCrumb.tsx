import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { parser } from '../shared/util/html-parse';
import { BreadCrumbItem } from './breadcrumb-item';

import classes from './BreadCrumb.module.css';

interface Props {
	urlKey: string;
}

const BeardCrumb: React.FC<Props> = ({ urlKey }) => {
	const {
		isLoading,
		isError,
		data: BreadCrumbItem,
		error,
	} = useQuery<BreadCrumbItem[], Error>(['breadcrumbs', urlKey], async () => {
		try {
			return await httpFetch<BreadCrumbItem[]>(
				`${configData.BACKEND_URL}/categories/hierarchy/${urlKey}`
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	if (isError) {
		return <div id={classes['bread-crumbs-wrapper']}>{error.message}</div>;
	}

	return (
		<>
			<div id={classes['bread-crumbs-wrapper']}>
				<div className={classes['bread-crumbs']}>
					<ul className={classes['bread-crumb']}>
						<li>
							<Link to='/'>Home</Link>
						</li>
						{BreadCrumbItem?.map((item) => {
							return (
								<li key={item.id} id={item.id}>
									<Link
										to={`/category/${
											item.url_key
												? item.url_key
												: item.id
										}`}>
										{parser(item.title)}
									</Link>
								</li>
							);
						})}
						{/* <li>
                    <Link to="/category/product">Product</Link>
                </li> */}
					</ul>
				</div>
			</div>
		</>
	);
};

export default BeardCrumb;
