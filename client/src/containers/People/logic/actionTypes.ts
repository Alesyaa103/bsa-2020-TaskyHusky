export const START_LOADING = 'PEOPLE_PAGE:START_LOADING';
export const SUCCESS_LOADING = 'PEOPLE_PAGE:SUCCESS_LOADING';

export const ADD_PEOPLE = 'PEOPLE_PAGE:ADD_PEOPLE';
export const CREATE_TEAM = 'PEOPLE_PAGE:CREATE_TEAM';

export type SuccessLoading = {
	people: WebApi.Entities.UserProfile[];
	teams: WebApi.Entities.Team[];
};

export type addPeople = {
	email: string;
	id: string;
};

export type createTeam = {
	name: string;
	id: string;
};

export type startLoading = {
	id: string;
};
