import axios from "axios";

import {
  ROOT_URL,
  FETCH_PATIENTS,
  FETCH_PATIENT,
  FETCH_PATIENTS_SEACHED
} from "../constants/ActionTypes";

export function fetchPatients() {
  const url = `${ROOT_URL}/api/patients`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_PATIENTS,
        payload: data
      });
    });
  };
}
export function fetchPatient(id) {
  const query = `/id=${id}`;
  const url = `${ROOT_URL}/api/patients${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_PATIENT,
        payload: data
      });
    });
  };
}
export function fetchPatientsSearched(searchByName) {
  const query = `/searchByName=${searchByName}`;
  const url = `${ROOT_URL}/api/patients${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_PATIENTS_SEACHED,
        payload: data
      });
    });
  };
}
