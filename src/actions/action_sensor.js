import axios from "axios";

import {
  ROOT_URL,
  FETCH_SENSORS,
  FETCH_SENSOR
} from "../constants/ActionTypes";

const URL = `${ROOT_URL}/api/sensors`;

export function fetchSensors() {
  const url = `${URL}`;

  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_SENSORS,
        payload: data
      });
    });
  };
}
export function fetchSensor(id) {
    const query = `/id=${id}`
    const url = `${URL}${query}`;
  
    const request = axios.get(url);
  
    return dispatch => {
      return request.then(({ data }) => {
        dispatch({
          type: FETCH_SENSOR,
          payload: data
        });
      });
    };
  }
  