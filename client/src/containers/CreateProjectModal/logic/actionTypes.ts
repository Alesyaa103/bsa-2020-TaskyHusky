export const OPEN_MODAL = 'CREATE_PROJECT:OPEN_MODAL';
export const CLOSE_MODAL = 'CREATE_PROJECT:CLOSE_MODAL';
export const START_CREATING_PROJECT = 'CREATE_PROJECT:START_CREATING_PROJECT';
export const SUCCESS_CREATING_PROJECT = 'CREATE_PROJECT:SUCCESS_CREATING_PROJECT';
export const FAIL_CREATING_PROJECT = 'CREATE_PROJECT:FAIL_CREATING_PROJECT';
export const RESET_STATE = 'CREATE_PROJECT:RESET_STATE';

export type InitialProject = {
	name: string;
	key: string;
	template: string;
};
