import React, { useContext } from 'react';
import { json, redirect, useLocation, Link, useParams } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';

import { AuthContextIf } from '../shared/context/auth-context';
import ErrorBoundary from '../components/Errors/ErrorBoundary';

import AuthForm from '../components/Users/AuthForm';
import { CustomerData, Props } from '../components/Users/Shared';

import classes from './Authentication.module.css';

let apiPath: string;

const headers = {
	'Content-Type': 'application/json',
	withCredentials: true,
	credentials: 'include',
};

export function loginAction(auth: AuthContextIf, queryClient?: QueryClient) {
	// note: returns a closure called by the router action with
	// reference to the auth context
	return async function action({ params, request }: Props) {
		console.log('login action', request);
		console.log('user auth', auth);

		apiPath = '/auth/login';
		const data = await request.formData();
		const authData = {
			username: data.get('username'),
			password: data.get('password'),
		};

		try {
			const responseData: CustomerData = await httpFetch(
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
	const location = useLocation();
	let { login, message } = useParams();
	const isLogin = location.pathname === '/login' || login;

	console.log('current location', location.pathname);
	console.log('login', isLogin, 'message', message);

	return (
		<div className={classes['login__container']}>
			<div
				className={`${
					location.pathname === '/create-account'
						? classes['create-account-grid']
						: classes['login__grid']
				}`}>
				<div className={`${classes['login__form']} flex`}>
					<ErrorBoundary>
						<AuthForm />
					</ErrorBoundary>

					{isLogin && (
						<div className={classes['login__new-account']}>
							{login ? (
								<>
									{message ? (
										<h2>{message}</h2>
									) : (
										<h2>Your Account has been created</h2>
									)}
									<p>Please login</p>
								</>
							) : (
								<>
									<h2>New Account Sign Up</h2>
									<p>
										If you do not have an online account,
										you can create one here.
									</p>
									<Link
										className={
											classes['create-account__button']
										}
										to='/create-account'>
										Sign Up
									</Link>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthenticationPage;
