import axios from "axios";

import {
  ROOT_URL,
  FETCH_BEDS_AT,
  FETCH_BED,
} from "../constants/ActionTypes";

export function fetchBedsAt(id) {
    const query = `/room=${id}`;
    const url = `${ROOT_URL}/api/beds${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_BEDS_AT,
          payload: data
        });
      });
    };
  }
  export function fetchBed(id) {
    const query = `/id=${id}`;
    const url = `${ROOT_URL}/api/beds${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_BED,
          payload: data
        });
      });
    };
  }