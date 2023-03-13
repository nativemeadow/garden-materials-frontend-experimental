import React, { useContext } from 'react';
import { json, redirect } from 'react-router-dom';
import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { AuthContext } from '../shared/context/auth-context';
import { AuthContextIf } from '../shared/context/auth-context';
import { useManageUsers } from '../shared/hooks/use-manageUsers';
import ErrorBoundary from '../components/Errors/ErrorBoundary';

import AuthForm from '../components/Users/AuthForm';

import classes from './Authentication.module.css';

export function loginAction(auth: AuthContextIf) {
	const userAuth = auth;

	interface Props {
		params?: any;
		request?: any;
	}

	return async function action({ params, request }: Props) {
		console.log('login action', request);
		console.log('user auth', userAuth);

		const data = await request.formData();
		const authData = {
			username: data.get('username'),
			password: data.get('password'),
		};
		const apiPath = '/auth/login';

		const headers = {
			'Content-Type': 'application/json',
			withCredentials: true,
			credentials: 'include',
		};

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}${apiPath}`,
				'POST',
				JSON.stringify(authData),
				headers
			);
			console.log('logged in user:', responseData);
			if (!responseData.message) {
				auth.login(
					responseData.userId,
					responseData.username,
					responseData.email,
					responseData.firstName,
					responseData.lastName,
					responseData.phone,
					responseData.token
				);
				return redirect('/welcome');
			}

			if (responseData.status === 422 || responseData.status === 401) {
				return responseData;
			}

			if (responseData.message) {
				return json(
					{
						message: `Authentication failed: ${responseData.message}`,
					},
					{ status: 500 }
				);
			}
		} catch (err) {
			console.error(`error occurred with ${apiPath} - ${err}`);
			return json(
				{
					message: `Error authenticating user: ${err}`,
				},
				{ status: 500 }
			);
		}

		return redirect('/');
	};
}

const AuthenticationPage = () => {
	const auth = useContext(AuthContext);

	return (
		<div className={classes['login__container']}>
			<div className={classes['login__grid']}>
				<div className={classes['login__form']}>
					<ErrorBoundary>
						<AuthForm />
					</ErrorBoundary>
				</div>
				<div className={classes['login__new-account']}></div>
			</div>
		</div>
	);
};

export default AuthenticationPage;
