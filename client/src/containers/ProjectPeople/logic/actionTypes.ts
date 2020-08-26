export const START_ADDING_USERS = 'PROJECT_PEOPLE:START_ADDING_USERS';
export const SUCCESS_ADDING_USERS = 'PROJECT_PEOPLE:SUCCESS_ADDING_USERS';
export const FAIL_ADDING_USERS = 'PROJECT_PEOPLE:FAIL_ADDING_USERS';

export type addingUsers = {
	usersId: string[];
	projectId: string;
};

export const START_DELETING_USERS = 'PROJECT_PEOPLE:START_DELETING_USERS';
export const SUCCESS_DELETING_USERS = 'PROJECT_PEOPLE:SUCCESS_DELETING_USERS';
export const FAIL_DELETING_USERS = 'PROJECT_PEOPLE:FAIL_DELETING_USERS';

export type deletingUsers = {
	usersId: string;
	projectId: string;
};

export const RESET_STATE = 'PROJECT_PEOPLE:FAIL_DELETING_USERS';