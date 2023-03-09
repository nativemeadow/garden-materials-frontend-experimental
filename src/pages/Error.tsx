import React from 'react';
import { useRouteError } from 'react-router-dom';
import TopBar from '../components/PageElements/TopBar';
import HeaderNav from '../components/PageElements/HeaderNav';

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
	let message = 'Something went wrong!';

	if (error.status === 500) {
		message = error.data.message;
	}

	if (error.status === 404) {
		title = 'Not found!';
		message = 'Could not find resource or page.';
	}

	return (
		<>
			<TopBar />
			<HeaderNav />
			<div className='container'>
				<main className={classes['error-detail']}>
					<p className={classes['error-message']}>{message}</p>
				</main>
			</div>
		</>
	);
};

export default ErrorPage;
