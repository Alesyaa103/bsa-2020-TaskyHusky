import { getTeam, updateFieldById, updateLinks, deleteOneLink } from 'services/team.service';
import { all, put, takeEvery, call } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
type Props = {
	id: string;
	type: string;
};
export function* fetchTeam(props: Props) {
	const team = yield call(getTeam, props.id);
	yield put(actions.successLoading({ team }));
}

export function* fetchLinks(props: any) {
	const team = yield call(updateLinks, props.id, props.link);
	yield put(actions.addLinkSuccess({ team }));
}
export function* deleteLink(props: any) {
	const team = yield call(deleteOneLink, props.id, props.link);
	yield put(actions.deleteLinkSuccess({ team }));
}
export function* updateField(props: any) {
	const team = yield call(updateFieldById, props.id, props.field);
	yield put(actions.deleteLinkSuccess({ team }));
}

export function* watchStartLoading() {
	yield takeEvery(actionTypes.START_LOADING, fetchTeam);
}
export function* watchAddLinksLoading() {
	yield takeEvery(actionTypes.ADD_LINK_LOADING, fetchLinks);
}

export function* watchDeleteLinksLoading() {
	yield takeEvery(actionTypes.DELETE_LINK_LOADING, deleteLink);
}

export function* watchFieldUpdateLoading() {
	yield takeEvery(actionTypes.UPDATE_FIELD_LOADING, updateField);
}

export default function* teamSaga() {
	yield all([watchStartLoading(), watchAddLinksLoading(), watchFieldUpdateLoading(), watchDeleteLinksLoading()]);
}
