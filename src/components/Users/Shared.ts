export const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
export const PWD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export interface Props {
	params?: any;
	request?: any;
}

export interface CustomerData {
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
	success?: string;
}

export interface CustomerCreatedData {
	message: string;
	status: number;
	success: boolean;
}
