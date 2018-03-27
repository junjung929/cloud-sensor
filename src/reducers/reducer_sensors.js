import {
  FETCH_SENSORS,
  FETCH_FREE_SENSORS,
  FETCH_SENSOR,
  FETCH_SENSORS_AT
} from "../constants/ActionTypes";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_SENSOR:
      return { ...state, sensor: action.payload };
    case FETCH_SENSORS:
      return { ...state, sensors: action.payload };
    case FETCH_FREE_SENSORS:
      return { ...state, free_sensors: action.payload };
    case FETCH_SENSORS_AT:
      return { ...state, sensors_at: action.payload };
    default:
      return state;
  }
}
