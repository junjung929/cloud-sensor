import {
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  FETCH_FLOORS_AT,
  ADD_HOSPITAL,
  EDIT_HOSPITAL,
  RESET_HOSPITAL_FORM
} from "../constants/ActionTypes";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_FLOORS_AT:
      return { ...state, floors_at: action.payload };
    case FETCH_HOSPITAL:
      return { ...state, hospital: action.payload };
    case FETCH_HOSPITALS:
      return { ...state, hospitals: action.payload };
    case ADD_HOSPITAL:
      return { ...state, add_hospital: action.payload };
    case EDIT_HOSPITAL:
      return { ...state, edit_hospital: action.payload };
    case RESET_HOSPITAL_FORM:
      return { ...state, add_hospital: "none" };
    default:
      return state;
  }
}
