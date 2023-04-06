import React, { useRef, useState } from 'react';

import { Form, useActionData, useParams, useNavigate } from 'react-router-dom';
import { json, redirect } from 'react-router-dom';
import httpFetch from '../../shared/http/http-fetch';

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

export const action = async ({ params, request }: Props) => {
	console.log('account loader action', request);

	const data = await request.formData();
	const authData = {
		user_id: data.get('userId'),
		currentPassword: data.get('currentPassword'),
		newPassword: data.get('newPassword'),
		passwordConfirmation: data.get('confirmPassword'),
	};

	const headers = {
		'Content-Type': 'application/json',
	};

	const apiPath = '/auth/resetPassword';

	type UpdateResponse = {
		success: boolean;
		message: string;
	};

	try {
		const responseJson: UpdateResponse = await httpFetch(
			`${configData.BACKEND_URL}${apiPath}`,
			'PUT',
			JSON.stringify(authData),
			headers
		);

		return responseJson.success
			? redirect(`/user/welcome/${responseJson.message}`)
			: json(
					{
						message: `Password change failed: ${responseJson.message}`,
					},
					{ status: 500 }
			  );
	} catch (err) {
		return json(
			{
				message: `Password change failed: ${err}`,
			},
			{ status: 500 }
		);
	}
};

const ResetPassword = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	return <div>RestPassword</div>;
};

export default ResetPassword;
