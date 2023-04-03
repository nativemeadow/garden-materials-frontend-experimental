import React, { useRef, useState } from 'react';
import ErrorBoundary from '../Errors/ErrorBoundary';

import classes from '../../pages/Authentication.module.css';

const AuthWrapper = (props: { children: React.ReactNode }) => {
	return (
		<div className={classes['login__container']}>
			<div
				className={`${
					location.pathname === '/create-account'
						? classes['create-account-grid']
						: classes['login__grid']
				}`}>
				<div className={classes['login__form']}>
					<ErrorBoundary>{props.children}</ErrorBoundary>
				</div>
			</div>
		</div>
	);
};

export default AuthWrapper;
