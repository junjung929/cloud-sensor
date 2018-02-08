import axios from "axios";

import {
  ROOT_URL,
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  ADD_HOSPITAL,
  EDIT_HOSPITAL,
  DELETE_HOSPITAL,
  ADD_FLOOR_AT,
  DELETE_FLOOR_AT,
  RESET_HOSPITAL_FORM
} from "../constants/ActionTypes";

const URL = `${ROOT_URL}/api/hospitals`;
// get
export function fetchHospitals() {
  const url = `${URL}`;
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
  const url = `${URL}${query}`;
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
    return request.then(({ data }) => {
      dispatch({
        type: ADD_HOSPITAL,
        payload: data
      });
    });
  };
}
export function editHospital(id, values, file) {
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
          type: EDIT_HOSPITAL,
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

export function deleteHospital(id) {
  const query = `/delete/${id}`;
  const url = `${URL}${query}`;
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
