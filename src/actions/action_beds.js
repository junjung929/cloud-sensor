import axios from "axios";

import {
  ROOT_URL,
  FETCH_BEDS_AT,
  FETCH_BED,
  ADD_BED,
  EDIT_BED,
  DELETE_BED,
  ADD_PATIENT_AT,
  DELETE_PATIENT_AT,
  ADD_SENSOR_AT,
  DELETE_SENSOR_AT
} from "../constants/ActionTypes";

const URL = `${ROOT_URL}/api/beds`;
export function fetchBedsAt(id) {
  const query = `/room=${id}`;
  const url = `${URL}${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_BEDS_AT,
        payload: data
      });
    });
  };
}
export function fetchBed(id) {
  const query = `/id=${id}`;
  const url = `${URL}${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_BED,
        payload: data
      });
    });
  };
}

// post
export function addBed(values, file) {
  const query = `/push`;
  const url = `${URL}${query}`;
  const config = {
    method: "post",
    url,
    data: file,
    params: values
  };
  const request = axios(config);

  return dispatch => {
    return request
      .then(({ data }) => {
        dispatch({
          type: ADD_BED,
          payload: data
        });
        return data;
      })
      .catch(({ response }) => {
        return response.data;
      });
  };
}
export function editBed(id, values, file) {
  const query = `/update/id=${id}`;
  const url = `${URL}${query}`;
  const config = {
    method: "post",
    url,
    data: file,
    params: values
  };
  const request = axios(config);

  return dispatch => {
    console.log(request);
    return request
      .then(({ data }) => {
        console.log(request);

        dispatch({
          type: EDIT_BED,
          payload: "SUCCESS"
        });
      })
      .catch(({ response }) => {
        console.log(response.data.err);
        return response.data.err;
      });
  };
}

// delete

export function deleteBed(id) {
  const query = `/delete/${id}`;
  const url = `${URL}${query}`;
  const request = axios.delete(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_BED,
        payload: id
      });
    });
  };
}


export function addPatientAt(id, patientId) {
  const query = `/add_patient/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, patientId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_PATIENT_AT,
        payload: id
      });
    });
  };
}
export function deletePatientAt(id, patientId) {
  const query = `/delete_patient/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, patientId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_PATIENT_AT,
        payload: id
      });
    });
  };
}
export function addSensorAt(id, sensorId) {
  const query = `/add_sensor/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, sensorId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_SENSOR_AT,
        payload: id
      });
    });
  };
}
export function deleteSensorAt(id, sensorId) {
  const query = `/delete_sensor/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, sensorId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_SENSOR_AT,
        payload: id
      });
    });
  };
}
