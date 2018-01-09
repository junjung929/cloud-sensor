import axios from "axios";

import {
  ROOT_URL,
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  ADD_HOSPITAL,
  EIDT_HOSPITAL,
  DELETE_HOSPITAL,
  RESET_HOSPITAL_FORM
} from "../constants/ActionTypes";

// get
export function fetchHospitals() {
  const url = `${ROOT_URL}/api/hospitals`;
  const request = axios.get(url);

  return dispatch => {
    request.then(({ data }) => {
      dispatch({
        type: FETCH_HOSPITALS,
        payload: data
      });
    });
  };
}
export function fetchHospital(id) {
  const query = `/id=${id}`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.get(url);

  return dispatch => {
    request.then(({ data }) => {
      dispatch({
        type: FETCH_HOSPITAL,
        payload: data
      });
    });
  };
}
// post
export function addHospital(values, file) {
  const query = `/push`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.post(url, values);

  return dispatch => {
    request.then(({ data }) => {
      console.log(data);
      dispatch({
        type: ADD_HOSPITAL,
        payload: data
      });
    });
    return request.then(response => {
      return response;
    });
  };
}

export function editHospital(values, file) {
  const query = ``;
  const url = `${ROOT_URL}/api/hospitals`;
  const request = axios.post(url);
}

// delete

export function deleteHospital(id) {
  const query = `/delete/${id}`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.delete(url);

  return dispatch => {
    request.then(({ data }) => {
      dispatch({
        type: DELETE_HOSPITAL,
        payload: id
      });
    });
    return request.then(response => {
      return response;
    });
  };
}

export function resetHospitalForm() {
  return dispatch => {
    dispatch({
      type: RESET_HOSPITAL_FORM,
      payload: "reset"
    });
  };
}
