import _ from 'lodash';
import {
    FETCH_PATIENTS,
    FETCH_PATIENT,
    FETCH_PATIENTS_SEACHED
} from 'constants/ActionTypes';

export default function(state = {}, action) {
    switch (action.type) {
        case FETCH_PATIENTS_SEACHED:
            return { ...state, patients_searched: action.payload };
        case FETCH_PATIENT:
            return { ...state, patient: action.payload };
        case FETCH_PATIENTS:
            return { ...state, patients: action.payload };
        default:
            return state;
    }
}