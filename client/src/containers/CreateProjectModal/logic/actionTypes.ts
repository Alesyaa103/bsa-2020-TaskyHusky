export const START_CREATING_PROJECT = 'CREATE_PROJECT:START_CREATING_PROJECT';
export const SUCCESS_CREATING_PROJECT = 'CREATE_PROJECT:SUCCESS_CREATING_PROJECT';
export const FAIL_CREATING_PROJECT = 'CREATE_PROJECT:FAIL_CREATING_PROJECT';
export const RESET_STATE = 'CREATE_PROJECT:RESET_STATE';
export const START_GETTING_KEYS = 'CREATE_PROJECT:START_GETTING_KEYS';
export const SUCCESS_GETTING_KEYS = 'CREATE_PROJECT:SUCCESS_GETTING_KEYS';
export const FAIL_GETTING_KEYS = 'CREATE_PROJECT:FAIL_GETTING_KEYS';

export type InitialProject = {
	name: string;
	key: string;
	template: string;
	icon: string;
	githubUrl: string;
};

export type Keys = {
	keys: { [key: string]: string };
};
