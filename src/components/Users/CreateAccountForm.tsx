import React, { useRef, useState } from 'react';

import { Form, useActionData } from 'react-router-dom';

import classes from './AuthForm.module.css';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const CreateAccountForm = () => {
	const data = useActionData() as {
		errors?: { [key: string]: string };
		message?: string;
	};
	const userNameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const [formIsNotValid, setFormIsNotValid] = useState(true);

	const validForm = (event: React.ChangeEvent<HTMLInputElement>) => {
		let validAnswer = false;
		validAnswer =
			userNameRef.current?.value.length! > 0 &&
			firstNameRef.current?.value.length! > 0 &&
			lastNameRef.current?.value.length! > 0 &&
			emailRef.current?.value.length! > 0 &&
			passwordRef.current?.value.length! > 0 &&
			confirmPasswordRef.current?.value.length! > 0;

		if (!formIsNotValid && validAnswer) {
			return;
		}
		setFormIsNotValid(!validAnswer);
	};

	return (
		<div className={classes['content-wrapper']}>
			<h2 className='text-3xl mb-4'>Create My Account</h2>
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
									htmlFor='Username'>
									Username:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--username']}`}
									id='Username'
									type='Username'
									name='username'
									placeholder='Username'
									ref={userNameRef}
									onBlur={validForm}
									onChange={validForm}
									required
								/>
							</div>
							<div className=''>
								<label
									className={`${classes['form-field-label']} ${classes['login__label']}`}
									htmlFor='password'>
									Password:
								</label>
								<input
									className={`${classes['form-field']} ${classes['login__form--password']}`}
									id='password'
									type='password'
									name='password'
									placeholder='Password'
									ref={passwordRef}
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

export default CreateAccountForm;
