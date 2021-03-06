import { fetchPeople, createInvite, addTeam } from '../../../services/people.service';
import { fetchTeams } from '../../../services/team.service';
import { all, put, takeEvery, call } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import { NotificationManager } from 'react-notifications';

export function* fetchPeoplePage(action: ReturnType<typeof actions.startLoading>) {
	const teams = yield call(fetchTeams);
	const people = yield call(fetchPeople, action.id);

	yield put(actions.SuccessLoading({ teams, people }));
}

export function* watchStartLoading() {
	yield takeEvery(actionTypes.START_LOADING, fetchPeoplePage);
}

export function* addPeople(action: ReturnType<typeof actions.addPeople>) {
	const { id, email } = action;
	try {
		yield call(createInvite, { userId: id, email });

		NotificationManager.success('invite sent', 'Invitation');
	} catch (error) {
		console.log(error);
		NotificationManager.error(error.clientException.message, 'Error');
	}
}

export function* watchAddPeople() {
	yield takeEvery(actionTypes.ADD_PEOPLE, addPeople);
}

export function* createTeam(action: ReturnType<typeof actions.createTeam>) {
	const { id, name } = action;
	try {
		yield call(addTeam, { userId: id, name });

		NotificationManager.success('Team created', 'Success');
		yield put(actions.startLoading({ id }));
	} catch (error) {
		console.log(error);
		NotificationManager.error(error.clientException.message, 'Error');
	}
}

export function* watchCreateTeam() {
	yield takeEvery(actionTypes.CREATE_TEAM, createTeam);
}

export default function* projectsSaga() {
	yield all([watchStartLoading(), watchAddPeople(), watchCreateTeam()]);
}
