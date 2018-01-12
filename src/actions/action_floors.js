import axios from "axios";

import {
  ROOT_URL,
  FETCH_FLOORS_AT,
  FETCH_FLOOR
} from "../constants/ActionTypes";

export function fetchFloorsAt(id) {
  const query = `/hospital=${id}`;
  const url = `${ROOT_URL}/api/floors${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_FLOORS_AT,
        payload: data
      });
    });
  };
}
export function fetchFloor(id) {
  const query = `/id=${id}`;
  const url = `${ROOT_URL}/api/floors${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_FLOOR,
        payload: data
      });
    });
  };
}
