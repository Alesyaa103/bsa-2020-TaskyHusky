import { createAction } from 'helpers/createAction.helper';
import * as actionTypes from './actionTypes';

export const startLoading = createAction<actionTypes.startLoading>(actionTypes.START_LOADING);
export const successLoading = createAction<actionTypes.successLoading>(actionTypes.SUCCESS_LOADING);

export const changeInviteStatus = createAction<actionTypes.changeInviteStatus>(actionTypes.CHANGE_INVITE_STATUS);
