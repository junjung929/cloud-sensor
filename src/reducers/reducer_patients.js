import _ from "lodash";
import {
  FETCH_PATIENTS,
  FETCH_FREE_PATIENTS,
  FETCH_PATIENT,
  FETCH_PATIENTS_SEACHED,
  FETCH_PATIENTS_AT
} from "../constants/ActionTypes";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_PATIENTS_SEACHED:
      return { ...state, patients_searched: action.payload };
    case FETCH_PATIENT:
      return { ...state, patient: action.payload };
    case FETCH_PATIENTS:
      return { ...state, patients: action.payload };
      case FETCH_FREE_PATIENTS:
      return { ...state, free_patients: action.payload };
    case FETCH_PATIENTS_AT:
      return { ...state, patients_at: action.payload };
    default:
      return state;
  }
}
