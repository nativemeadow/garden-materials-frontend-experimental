import React, { useRef, useState } from 'react';

import {
	Form,
	Link,
	useSearchParams,
	useActionData,
	useNavigation,
	useResolvedPath,
} from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
	const data = useActionData() as {
		errors?: { [key: string]: string };
		message?: string;
	};
	const navigation = useNavigation();
	const [searchParams] = useSearchParams();
	const userNameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [formIsNotValid, setFormIsNotValid] = useState(true);

	const validForm = (event: React.ChangeEvent<HTMLInputElement>) => {
		let validAnswer = false;
		validAnswer =
			userNameRef.current?.value.length! > 0 &&
			passwordRef.current?.value.length! > 0;

		setFormIsNotValid(!validAnswer);
	};

	return (
		<div className={classes['content-wrapper']}>
			<h2 className='text-3xl mb-4'>Login</h2>
			{data && data.errors && (
				<ul>
					{Object.values(data.errors).map((error, index) => (
						<li key={index}>{error}</li>
					))}
				</ul>
			)}
			{data && data.message && <p>{data.message}</p>}
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

export default AuthForm;
