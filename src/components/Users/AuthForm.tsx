import React from 'react';

import {
	Form,
	Link,
	useSearchParams,
	useActionData,
	useNavigation,
} from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
	const data = useActionData() as {
		errors?: { [key: string]: string };
		message?: string;
	};
	const navigation = useNavigation();
	const [searchParams] = useSearchParams();

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
									required
								/>
							</div>
							<div className=''>
								<button className={classes['login__button']}>
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
