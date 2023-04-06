import React, { useState, useRef } from 'react';
import { Form, json, redirect, useActionData } from 'react-router-dom';
import httpFetch from '../../shared/http/http-fetch';
import { Props } from './Shared';
import AuthWrapper from './AuthWrapper';
import configData from '../../config.json';

import classes from './AuthForm.module.css';

export const action = async ({ params, request }: Props) => {
	console.log('action - forgot password');

	const apiPath = '/auth/forgotPassword';
	const data = await request.formData();
	const forgotPasswordInfo = {
		email: data.get('email'),
	};

	const headers = {
		'Content-Type': 'application/json',
	};

	type UpdateResponse = {
		success: boolean;
		message: string;
	};

	try {
		const responseJson: UpdateResponse = await httpFetch(
			`${configData.BACKEND_URL}${apiPath}`,
			'PUT',
			JSON.stringify(forgotPasswordInfo),
			headers
		);

		console.log(responseJson);

		return responseJson.success
			? redirect(`/user/welcome/${responseJson.message}`)
			: json(
					{
						message: `forgot password change failed: ${responseJson.message}`,
					},
					{ status: 500 }
			  );
	} catch (error) {
		console.log(error);
	}
};

const ForgotPassword = () => {
	const [formIsNotValid, setFormIsNotValid] = useState(false);

	const data = useActionData() as {
		errors?: { [key: string]: string };
		message?: string;
	};

	const emailRef = useRef<HTMLInputElement>(null);
	const validForm = (event: React.ChangeEvent<HTMLInputElement>) => {
		let validAnswer = false;
		validAnswer = emailRef.current?.value.length! > 0;

		if (!formIsNotValid && validAnswer) {
			return;
		}
		setFormIsNotValid(!validAnswer);
	};

	return (
		<AuthWrapper>
			{data?.errors && (
				<ul className='text-sm mb-1'>
					{Object.values(data.errors).map((error, index) => (
						<li key={index}>{error}</li>
					))}
				</ul>
			)}
			{data?.message && <p className='text-sm mb-1'>{data.message}</p>}
			<div className={classes['login']}>
				<Form method='post'>
					<div className={`${classes['login-wrapper']}`}>
						<div className={'flex flex-col w-full'}>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='email'>
									Email:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--email']}`}
									id='email'
									type='email'
									name='email'
									placeholder='Email'
									ref={emailRef}
									onBlur={validForm}
									onChange={validForm}
									required
								/>
							</div>
							<div className=''>
								<button
									className={classes['login__button']}
									disabled={formIsNotValid}>
									Send Forgot Email
								</button>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</AuthWrapper>
	);
};

export default ForgotPassword;
