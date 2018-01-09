import _ from "lodash";
import {
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  ADD_HOSPITAL,
  RESET_HOSPITAL_FORM,
  FETCH_FLOORS_AT,
  FETCH_FLOOR,
  FETCH_ROOMS_AT,
  FETCH_ROOM,
  FETCH_BEDS_AT,
  FETCH_BED,
  FETCH_SENSOR_DATA
} from "constants/ActionTypes";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_SENSOR_DATA:
      return { ...state, sensor_data: action.payload };
    case FETCH_BED:
      return { ...state, bed: action.payload };
    case FETCH_BEDS_AT:
      return { ...state, beds_at: action.payload };
    case FETCH_ROOM:
      return { ...state, room: action.payload };
    case FETCH_ROOMS_AT:
      return { ...state, rooms_at: action.payload };
    case FETCH_FLOOR:
      return { ...state, floor: action.payload };
    case FETCH_FLOORS_AT:
      return { ...state, floors_at: action.payload };
    case FETCH_HOSPITAL:
      return { ...state, hospital: action.payload };
    case FETCH_HOSPITALS:
      return { ...state, hospitals: action.payload };
    case ADD_HOSPITAL:
      return { ...state, add_hospital: action.payload };
    case RESET_HOSPITAL_FORM:
      return { ...state, add_hospital: 'none' };
    default:
      return state;
  }
}
