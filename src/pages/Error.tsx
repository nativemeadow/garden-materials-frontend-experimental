import React from 'react';
import { useRouteError } from 'react-router-dom';

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
		<div>
			<p>{message}</p>
		</div>
	);
};

export default ErrorPage;
