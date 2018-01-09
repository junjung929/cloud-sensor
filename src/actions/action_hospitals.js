import axios from "axios";

import {
  ROOT_URL,
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  ADD_HOSPITAL_INFO,
  EIDT_HOSPITAL_INFO
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
  