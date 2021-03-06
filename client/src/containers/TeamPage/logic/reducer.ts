import * as actionTypes from './actionTypes';
import { TeamState, initialState } from './state';
import { createReducer } from 'helpers/createReducer.helper';

export const teamReducer = createReducer<TeamState>(initialState, {
	[actionTypes.SUCCESS_TEAM_LOADING](state: TeamState, action: actionTypes.SuccessLoadingTeam) {
		return {
			...state,
			team: action.team,
			loading: false,
		};
	},

	[actionTypes.SUCCESS_TEAM_USERS_LOADING](state: TeamState, action: actionTypes.SuccessLoadingUsers) {
		return {
			...state,
			team: {
				...state.team,
				createdBy: action.createdBy,
				users: action.users,
			},
		};
	},

	[actionTypes.SUCCESS_TEAM_ISSUES_LOADING](state: TeamState, action: actionTypes.SuccessLoadingIssues) {
		return {
			...state,
			team: {
				...state.team,
				issues: action.issues,
			},
		};
	},

	[actionTypes.SUCCESS_TEAM_PROJECTS_LOADING](state: TeamState, action: actionTypes.SuccessLoadingProjects) {
		return {
			...state,
			team: {
				...state.team,
				projects: action.projects,
			},
		};
	},

	[actionTypes.UPDATE_FIELD_SUCCESS](state: TeamState, action: actionTypes.EditFieldSuccess) {
		return {
			...state,
			team: {
				...state.team,
				name: action.field.name,
				description: action.field.description,
			},
		};
	},

	[actionTypes.UPDATE_TEAM_USERS_SECCESS](state: TeamState, action: actionTypes.successAddingUsers) {
		return {
			...state,
			team: {
				...state.team,
				...action,
			},
		};
	},

	[actionTypes.UPDATE_LINK_FIELD_SUCCESS](state: TeamState, action: actionTypes.AddLinkSuccess) {
		return {
			...state,
			team: {
				...state.team,
				links: action.links,
			},
		};
	},

	[actionTypes.SUCCESS_SEARCHING_PEOPLE](state: TeamState, action: actionTypes.successSearchPeople) {
		return {
			...state,
			results: {
				users: {
					results: [...action.results],
				},
				loading: false,
			},
		};
	},
	[actionTypes.FAIL_SEARCHING_PEOPLE](state: TeamState) {
		return {
			...state,
			results: {
				...state.results,
				loading: false,
			},
		};
	},
	[actionTypes.SEARCH_PEOPLE_LOADER](state: TeamState) {
		return {
			...state,
			results: {
				...state.results,
				loading: true,
			},
		};
	},
	[actionTypes.DELETE_TEAM_SUCCESS](state: TeamState) {
		return initialState;
	},

	[actionTypes.SET_IS_LOADING](state: TeamState) {
		return {
			...state,
			team: {
				...state.team,
			},
			loading: true,
		};
	},
	[actionTypes.FAIL_LOADING](state: TeamState) {
		return {
			...state,
			loading: false,
		};
	},
});
