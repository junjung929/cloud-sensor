import axios from "axios";

import {
  ROOT_URL,
  FETCH_SENSORS,
  FETCH_FREE_SENSORS,
  FETCH_SENSOR,
  FETCH_SENSORS_AT,
  ADD_SENSOR,
  EDIT_SENSOR,
  DELETE_SENSOR
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
export function fetchFreeSensors() {
  const query = `/free`
  const url = `${URL}${query}`;

  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_FREE_SENSORS,
        payload: data
      });
    });
  };
}
export function fetchSensor(id) {
  const query = `/id=${id}`;
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
export function fetchSensorsAt(id) {
  const query = `/hospital=${id}`;
  const url = `${URL}${query}`;

  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_SENSORS_AT,
        payload: data
      });
    });
  };
}
// post
export function addSensor(values) {
  const query = `/push`;
  const url = `${URL}${query}`;
  const request = axios.post(url, values);

  return dispatch => {
    return request
      .then(({ data }) => {
        dispatch({
          type: ADD_SENSOR,
          payload: data
        });
        return data;
      })
      .catch(({ response }) => {
        return response.data;
      });
  };
}
export function editSensor(id, values) {
  const query = `/update/id=${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, values);

  return dispatch => {
    return request
      .then(({ data }) => {

        dispatch({
          type: EDIT_SENSOR,
          payload: "SUCCESS"
        });
      })
      .catch(({ response }) => {
        return response.data.err;
      });
  };
}

// delete

export function deleteSensor(id) {
  const query = `/delete/${id}`;
  const url = `${URL}${query}`;
  const request = axios.delete(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_SENSOR,
        payload: id
      });
    });
  };
}
