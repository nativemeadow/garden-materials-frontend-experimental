import React, { useRef, useState } from 'react';
import { useActionData, Form } from 'react-router-dom';

import classes from './AuthForm.module.css';

export const ProfileUpdateForm = () => {
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
	const [formIsNotValid, setFormIsNotValid] = useState(true);

	const validForm = (event: React.ChangeEvent<HTMLInputElement>) => {
		let validAnswer = false;
		validAnswer =
			firstNameRef.current?.value.length! > 0 &&
			lastNameRef.current?.value.length! > 0 &&
			emailRef.current?.value.length! > 0 &&
			addressRef.current?.value.length! > 0 &&
			cityRef.current?.value.length! > 0 &&
			stateRef.current?.value.length! > 0 &&
			zipRef.current?.value.length! > 0 &&
			phoneRef.current?.value.length! > 0;

		if (!formIsNotValid && validAnswer) {
			return;
		}
		setFormIsNotValid(!validAnswer);
	};

	return (
		<div className={classes['auth-form']}>
			<h2 className='text-3xl mb-4'>Update My Account</h2>
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
									required
								/>
							</div>
							<div className=''>
								<button
									className={classes['login__button']}
									disabled={formIsNotValid}>
									Login
								</button>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
};
