import React, { useContext } from 'react';
import { json, redirect, useLocation, Link, useParams } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';
import httpFetch from '../shared/http/http-fetch';
import configData from '../config.json';
import { AuthContext } from '../shared/context/auth-context';
import { AuthContextIf } from '../shared/context/auth-context';
import ErrorBoundary from '../components/Errors/ErrorBoundary';

import AuthForm from '../components/Users/AuthForm';
import CreateAccountForm from '../components/Users/CreateAccountForm';

import classes from './Authentication.module.css';

interface Props {
	params?: any;
	request?: any;
}

interface CustomerData {
	userId: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	token: boolean;
	message?: string;
	status?: number;
}

let apiPath = '/auth/login';

const headers = {
	'Content-Type': 'application/json',
	withCredentials: true,
	credentials: 'include',
};

const authenticateCustomerQuery = (username: string, password: string) => ({
	queryKey: ['customerInfo', username],
	queryFn: async () => {
		const authInput = {
			username: username,
			password: password,
		};
		const response = await httpFetch<CustomerData>(
			`${configData.BACKEND_URL}${apiPath}`,
			'POST',
			JSON.stringify(authInput),
			headers
		);
		console.log('customer detail response', response);
		if (!response) {
			throw json({ message: 'Could not fetch customer detail!' });
		} else {
			return response;
		}
	},
});

export function loginAction(auth: AuthContextIf, queryClient: QueryClient) {
	const userAuth = auth;

	// note: returns a closure called by the router action with
	// reference to the auth context
	return async function action({ params, request }: Props) {
		console.log('login action', request);
		console.log('user auth', userAuth);

		const data = await request.formData();
		const authData = {
			username: data.get('username'),
			password: data.get('password'),
		};

		const query = authenticateCustomerQuery(
			authData.username,
			authData.password
		);

		try {
			const responseData: CustomerData =
				queryClient.getQueryData(query.queryKey) ??
				(await queryClient.fetchQuery(query));
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

export async function createUserAction({ params, request }: Props) {
	console.log('create user action', request);

	const data = await request.formData();
	const authData = {
		type: '1',
		customer_type: '1',
		username: data.get('username'),
		password: data.get('password'),
		passwordConfirmation: data.get('confirmPassword'),
		email: data.get('email'),
		first_name: data.get('firstName'),
		last_name: data.get('lastName'),
	};
	apiPath = '/auth/signup';

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
			return redirect(`/login/true/${responseData.success}`);
		}
		if (responseData.status === 422 || responseData.status === 401) {
			return responseData;
		}

		if (responseData.message) {
			return json(
				{
					message: `Account creation failed: ${responseData.message}`,
				},
				{ status: 500 }
			);
		}
	} catch (err) {
		console.error(`error occurred with ${apiPath} - ${err}`);
	}
}

export async function accountLoader() {
	console.log('account loader');
}

export async function updateAccountAction({ params, request }: Props) {
	console.log('update account action', request);
}

const AuthenticationPage = () => {
	const location = useLocation();
	let { login, message } = useParams();
	const isLogin = location.pathname === '/login' || login;

	console.log('current location', location.pathname);
	console.log('login', isLogin, 'message', message);

	const selectForm = () => {
		if (isLogin) {
			return <AuthForm />;
		} else if (location.pathname === '/create-account') {
			return <CreateAccountForm />;
		}
	};

	return (
		<div className={classes['login__container']}>
			<div
				className={`${
					location.pathname === '/create-account'
						? classes['create-account-grid']
						: classes['login__grid']
				}`}>
				<div className={classes['login__form']}>
					<ErrorBoundary>{selectForm()}</ErrorBoundary>
				</div>
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
									If you do not have an online account, you
									can create one here.
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
	);
};

export default AuthenticationPage;
