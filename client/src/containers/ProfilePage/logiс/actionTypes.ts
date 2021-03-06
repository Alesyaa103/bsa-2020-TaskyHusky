import { UserProfileState } from './state';

export const REQUEST_GET_USER = 'USER:REQUEST_GET_USER';
export const UPDATE_USER = 'USER:UPDATE_USER';
export const REQUEST_UPDATE_USER = 'USER:REQUEST_UPDATE_USER';
export const DELETE_USER = 'USER:DELETE_USER';
export const REQUEST_DELETE_USER = 'USER:REQUEST_DELETE_USER';
export const REQUEST_CHANGE_PASSWORD = 'USER:REQUEST_CHANGE_PASSWORD';
export const REQUEST_UPDATE_AVATAR = 'USER:REQUEST_UPDATE_AVATAR';
export const SEND_EMAIL_RESET_LINK = 'USER:SEND_EMAIL_RESET_LINK';
export const SEND_PASS_RESET_LINK = 'USER:SEND_PASS_RESET_LINK';
export const RESET_EMAIL = 'USER:RESET_EMAIL';

export type RequestGetUser = {
	id: string;
};

export type UpdateUser = {
	partialState: Partial<UserProfileState>;
};

export type RequestUpdateUser = Partial<UserProfileState>;

export type RequestDeleteUser = null;

export type DeleteUser = null;

export type RequestChangePassword = {
	oldPassword: string;
	newPassword: string;
};

export type RequestUpdateAvatar = {
	image: File;
};

export type SendResetLink = {
	email: string;
};

export type RequestChangeEmail = {
	email: string;
	password: string;
	token: string;
};
