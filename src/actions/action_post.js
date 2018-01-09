import axios from "axios";

import {
  ROOT_URL,
  ADD_HOSPITAL_INFO,
  EIDT_HOSPITAL_INFO
} from "../constants/ActionTypes";

export function addHospitalInfo(values, file) {
  const query = `/push`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.post(url, values);

  return dispatch => {
    request.then(({ data }) => {
      dispatch({
        type: ADD_HOSPITAL_INFO,
        payload: request
      });
    });
    return request.then(response => {
      return response;
    });
  };
}

export function editHospitalInfo(values, file) {
  const query = ``;
  const url = `${ROOT_URL}/api/hospitals`;
  const request = axios.post(url);
}
