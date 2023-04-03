import React, { useRef, useState, useContext } from 'react';
import { json, redirect } from 'react-router-dom';
import { useActionData, Form, useRouteLoaderData } from 'react-router-dom';
import {
	statesProvinces,
	countries,
} from '../../shared/counties-locals/location-lookup';
import httpFetch from '../../shared/http/http-fetch';

import configData from '../../config.json';
import { AuthContextIf } from '../../shared/context/auth-context';
import { CustomerCreatedData, Props, USER_REGEX, PWD_REGEX } from './Shared';

import classes from './AuthForm.module.css';

let apiPath: string;

export const updateAccountLoader =
	(auth: AuthContextIf) =>
	async ({ params, request }: Props) => {
		console.log('account loader action', request, 'auth context', auth);

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};
		apiPath = '/auth/customer';

		try {
			const responseData: CustomerCreatedData = await httpFetch(
				`${configData.BACKEND_URL}${apiPath}`,
				'GET',
				null,
				headers
			);

			console.log('account loader response', responseData);

			if (responseData.message === 'ok') {
				return responseData;
			}

			if (responseData.message) {
				throw json(
					{
						message: `Account access failed: ${responseData.message}`,
					},
					{ status: 500 }
				);
			}

			if (responseData.status === 422 || responseData.status === 401) {
				return responseData;
			}
		} catch (err) {
			console.error(`error occurred with ${apiPath} - ${err}`);
		}
	};

export const updateAccountAction =
	(auth: AuthContextIf) =>
	async ({ params, request }: Props) => {
		console.log('account loader action', request, 'auth context', auth);

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};
		apiPath = '/auth/updateProfile';

		const data = await request.formData();
		const authData = {
			user_id: auth.userId,
			email: data.get('email'),
			first_name: data.get('firstName'),
			last_name: data.get('lastName'),
			address: data.get('address'),
			phone: data.get('phone'),
			city: data.get('city'),
			state_province: data.get('state_province'),
			postal_code: data.get('zip'),
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

			if (responseJson.success) {
				auth.updateUserSession(
					authData.email,
					authData.first_name,
					authData.last_name,
					authData.phone
				);
				// return redirect('/user/profile');
				return json(
					{ message: `Account update successful` },
					{ status: 200 }
				);
			} else {
				return json(
					{
						message: `Account update failed: ${responseJson.message}`,
					},
					{ status: 500 }
				);
			}
		} catch (err) {
			console.error(`error occurred with ${apiPath} - ${err}`);
		}
	};

const ProfileUpdateForm = () => {
	const userData = useRouteLoaderData('user-profile') as {
		message?: string;
		profile: {
			first_name: string;
			last_name: string;
			email: string;
			address: string;
			city: string;
			state_province: string;
			postal_code: string;
			phone: string;
		};
	};

	const [selectedStatesProvince, setSelectedStatesProvince] = useState<
		string | ''
	>(userData.profile === undefined ? '' : userData.profile.state_province);
	const data = useActionData() as {
		errors?: { [key: string]: string };
		message?: string;
	};
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const addressRef = useRef<HTMLInputElement>(null);
	const cityRef = useRef<HTMLInputElement>(null);
	const stateRef = useRef<HTMLInputElement>(null);
	const zipRef = useRef<HTMLInputElement>(null);
	const phoneRef = useRef<HTMLInputElement>(null);
	const [formIsNotValid, setFormIsNotValid] = useState(false);

	const stateProvenceChangeHandler = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSelectedStatesProvince(event.target.value);
		stateRef.current!.value = event.target.value;
	};

	const validForm = (event: React.ChangeEvent<HTMLInputElement>) => {
		let validAnswer = false;
		validAnswer =
			firstNameRef.current?.value.length! > 0 &&
			lastNameRef.current?.value.length! > 0 &&
			emailRef.current?.value.length! > 0 &&
			addressRef.current?.value.length! > 0 &&
			cityRef.current?.value.length! > 0 &&
			selectedStatesProvince?.length! > 0 &&
			zipRef.current?.value.length! > 0 &&
			phoneRef.current?.value.length! > 0;

		if (!formIsNotValid && validAnswer) {
			return;
		}
		setFormIsNotValid(!validAnswer);
	};

	return (
		<div className={classes['content-wrapper']}>
			<h2 className='text-3xl mb-4'>Update My Account</h2>
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
									defaultValue={
										userData.profile &&
										userData.profile.email
									}
									required
								/>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='firstName'>
									First Name:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--firstName']}`}
									id='firstName'
									type='text'
									name='firstName'
									placeholder='First Name'
									ref={firstNameRef}
									onBlur={validForm}
									onChange={validForm}
									defaultValue={
										userData.profile &&
										userData.profile.first_name
									}
									required
								/>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='lastName'>
									Last Name:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--lastName']}`}
									id='lastName'
									type='text'
									name='lastName'
									placeholder='Last Name'
									ref={lastNameRef}
									onBlur={validForm}
									onChange={validForm}
									defaultValue={
										userData.profile &&
										userData.profile.last_name
									}
									required
								/>
							</div>
							<div></div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='address'>
									Address:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--lastName']}`}
									id='address'
									type='text'
									name='address'
									placeholder='Address'
									ref={addressRef}
									onBlur={validForm}
									onChange={validForm}
									defaultValue={
										userData.profile &&
										userData.profile.address
									}
									required
								/>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='city'>
									City:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--lastName']}`}
									id='city'
									type='text'
									name='city'
									placeholder='City'
									ref={cityRef}
									onBlur={validForm}
									onChange={validForm}
									defaultValue={
										userData.profile &&
										userData.profile.city
									}
									required
								/>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='state'>
									State or Province:
								</label>
								<select
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									id='state'
									value={
										userData.profile &&
										selectedStatesProvince
									}
									onChange={stateProvenceChangeHandler}
									name='state_province'>
									{statesProvinces[0].states.map(
										(state, index) => {
											return (
												<option
													key={index}
													value={state.abbreviation}>
													{state.name}
												</option>
											);
										}
									)}
								</select>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='postalCode'>
									Postal Code:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--lastName']}`}
									id='postalCode'
									type='text'
									name='zip'
									placeholder='Postal Code'
									ref={zipRef}
									onBlur={validForm}
									onChange={validForm}
									defaultValue={
										userData.profile &&
										userData.profile.postal_code
									}
									required
								/>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='phone'>
									Phone:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--lastName']}`}
									id='phone'
									type='text'
									name='phone'
									placeholder='Phone'
									ref={phoneRef}
									onBlur={validForm}
									onChange={validForm}
									defaultValue={
										userData.profile &&
										userData.profile.phone
									}
									required
								/>
							</div>
							<div className=''>
								<button
									className={classes['login__button']}
									disabled={formIsNotValid}>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default ProfileUpdateForm;
