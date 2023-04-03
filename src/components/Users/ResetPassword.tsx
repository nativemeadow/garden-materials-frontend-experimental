import React, { useRef, useState } from 'react';

import { Form, useActionData } from 'react-router-dom';
import { json, redirect } from 'react-router-dom';

import configData from '../../config.json';

import { AuthContextIf } from '../../shared/context/auth-context';
import AuthWrapper from './AuthWrapper';

import classes from './AuthForm.module.css';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface Props {
	params?: any;
	request?: any;
}

// write action function to change password
export const changePasswordAction =
	(auth: AuthContextIf) =>
	async ({ params, request }: Props) => {
		console.log('account loader action', request, 'auth context', auth);

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};
		const apiPath = '/auth/changePassword';

		const data = await request.formData();
		const authData = {
			user_id: auth.userId,
			currentPassword: data.get('currentPassword'),
			newPassword: data.get('newPassword'),
			passwordConfirmation: data.get('confirmPassword'),
		};

		type UpdateResponse = {
			success: boolean;
			message: string;
		};

		try {
			const response = await fetch(
				`${configData.BACKEND_URL}${apiPath}`,
				{
					method: 'PUT',
					headers,
					body: JSON.stringify(authData),
				}
			);

			const responseJson: UpdateResponse = await response.json();

			return responseJson.success
				? redirect(`/user/welcome/${responseJson.message}`)
				: json(
						{
							message: `Password change failed: ${responseJson.message}`,
						},
						{ status: 500 }
				  );
		} catch (err) {
			console.error(`error occurred with ${apiPath} - ${err}`);
		}
	};

const ResetPassword = () => {
	const data = useActionData() as {
		errors?: { [key: string]: string };
		message?: string;
	};
	const currentPasswordRef = useRef<HTMLInputElement>(null);
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const [formIsNotValid, setFormIsNotValid] = useState(true);

	const validForm = (event: React.ChangeEvent<HTMLInputElement>) => {
		let validAnswer = false;
		validAnswer =
			currentPasswordRef.current?.value.length! > 0 &&
			newPasswordRef.current?.value.length! > 0 &&
			confirmPasswordRef.current?.value.length! > 0;

		if (!formIsNotValid && validAnswer) {
			return;
		}
		setFormIsNotValid(!validAnswer);
	};

	return (
		<AuthWrapper>
			<div className={classes['content-wrapper']}>
				<h2 className='text-3xl mb-4'>Reset My Password</h2>
				{data && data.errors && (
					<ul className='text-sm mb-1'>
						{Object.values(data.errors).map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}
				{data && data.message && (
					<p className='text-sm mb-1'>{data.message}</p>
				)}
				<div className={classes['login']}>
					<Form method='post'>
						<div className={classes['login-wrapper']}>
							<div className={'flex flex-col w-full'}>
								<div className=''>
									<label
										className={`${classes['form-field-label']} ${classes['login__label']}`}
										htmlFor='currentPassword'>
										Current Password:
									</label>
									<input
										className={`${classes['form-field']} ${classes['login__form--password']}`}
										id='currentPassword'
										type='password'
										name='currentPassword'
										placeholder='Current Password'
										ref={currentPasswordRef}
										onBlur={validForm}
										onChange={validForm}
										required
									/>
								</div>
								<div className=''>
									<label
										className={`${classes['form-field-label']} ${classes['login__label']}`}
										htmlFor='newPassword'>
										New Password:
									</label>
									<input
										className={`${classes['form-field']} ${classes['login__form--password']}`}
										id='newPassword'
										type='password'
										name='newPassword'
										placeholder='New Password'
										ref={newPasswordRef}
										onBlur={validForm}
										onChange={validForm}
										required
									/>
								</div>
								<div className=''>
									<label
										className={`${classes['form-field-label']} ${classes['login__label']}`}
										htmlFor='confirmPassword'>
										Confirm Password:
									</label>
									<input
										className={`${classes['form-field']} ${classes['login__form--password']}`}
										id='confirmPassword'
										type='password'
										name='confirmPassword'
										placeholder='Confirm Password'
										ref={confirmPasswordRef}
										onBlur={validForm}
										onChange={validForm}
										required
									/>
								</div>

								<div className=''>
									<button
										className={classes['login__button']}
										disabled={formIsNotValid}>
										Change Password
									</button>
								</div>
							</div>
						</div>
					</Form>
				</div>
			</div>
		</AuthWrapper>
	);
};

export default ResetPassword;
