import React from 'react';
import { useRouteError } from 'react-router-dom';
import TopBar from '../components/PageElements/TopBar';
import HeaderNav from '../components/PageElements/HeaderNav';
import Footer from '../components/PageElements/Footer';

import classes from './Error.module.css';

type error = {
	status: number;
	data: {
		message: string;
	};
};

const ErrorPage = () => {
	const error = useRouteError() as error;

	let title = 'An error occurred!';
	let message =
		error.status === 500 ? error.data.message : 'Something went wrong!';

	if (error.status === 404) {
		title = 'Not found!';
		message = 'Could not find resource or page.';
	}

	return (
		<div className='flex flex-col'>
			<TopBar />
			<HeaderNav />
			<div className='container'>
				<main className={classes['error-detail']}>
					<p className={`${classes['error-message']} text-sm`}>
						{message}
					</p>
				</main>
			</div>
			<Footer />
		</div>
	);
};

export default ErrorPage;
