import { createAction } from 'helpers/createAction.helper';
import * as actionTypes from './actionTypes';

export const fetchFilterParts = createAction<actionTypes.LoadFilterByIdArgs>(actionTypes.FETCH_FILTER_PARTS);

export const updateSearchSuccess = createAction<actionTypes.UpdateSearchArgs>(actionTypes.UPDATE_SEARCH_SUCCESS);

export const updateFilterPart = createAction<actionTypes.UpdateFilterPartArgs>(actionTypes.UPDATE_FILTER_PART);
export const updateFilterPartSuccess = createAction<actionTypes.UpdateFilterPartArgs>(
	actionTypes.UPDATE_FILTER_PART_SUCCESS,
);

export const loadIssues = createAction(actionTypes.LOAD_ISSUES);
export const loadIssuesSuccess = createAction<actionTypes.LoadIssuesSuccessArgs>(actionTypes.LOAD_ISSUES_SUCCESS);

export const loadFilterById = createAction<actionTypes.LoadFilterByIdArgs>(actionTypes.LOAD_FILTER);
export const loadFilterByIdSuccess = createAction<actionTypes.LoadFilterSuccessArgs>(actionTypes.LOAD_FILTER_SUCCESS);

export const setAddedFilterParts = createAction<actionTypes.SetAddedFilterPartsArgs>(
	actionTypes.SET_ADDED_FILTER_PARTS,
);
