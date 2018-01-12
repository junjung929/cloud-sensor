import axios from "axios";

import {
  ROOT_URL,
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  ADD_HOSPITAL,
  EDIT_HOSPITAL,
  DELETE_HOSPITAL,
  RESET_HOSPITAL_FORM
} from "../constants/ActionTypes";

// get
export function fetchHospitals() {
  const url = `${ROOT_URL}/api/hospitals`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
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
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_HOSPITAL,
        payload: data
      });
    });
  };
}
// post
export function addHospital(values, file) {
  const { name, address, phone_number } = values;
  const query = `/push/name=${name}/address=${address}/phone=${phone_number}`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_HOSPITAL,
        payload: data
      });
    });
  };
}
export function editHospital(id, values, file) {
  const { name, address, phone_number } = values;
  const query = `/update/id=${id}/name=${name}/address=${address}/phone=${phone_number}`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    console.log(request);
    return request
      .then(({ data }) => {
    console.log(request);
        
        dispatch({
          type: EDIT_HOSPITAL,
          payload: 'SUCCESS'
        });
      })
      .catch(({ response }) => {
        console.log(response.data.err);
        return response.data.err;
      });
  };
}

// delete

export function deleteHospital(id) {
  const query = `/delete/${id}`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.delete(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_HOSPITAL,
        payload: id
      });
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
