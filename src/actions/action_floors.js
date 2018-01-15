import axios from "axios";

import {
  ROOT_URL,
  FETCH_FLOORS_AT,
  FETCH_FLOOR,
  ADD_FLOOR,
  EDIT_FLOOR,
  DELETE_FLOOR
} from "../constants/ActionTypes";

const URL = `${ROOT_URL}/api/floors`;
export function fetchFloorsAt(id) {
  const query = `/hospital=${id}`;
  const url = `${URL}${query}`;
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
  const url = `${URL}${query}`;
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
// post
export function addFloor(values, file) {
  const { number, floorAt  } = values;
  const query = `/push/number=${number}/floorAt=${floorAt}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_FLOOR,
        payload: data
      });
      return data
    });
  };
}
export function editFloor(id, values, file) {
  const { number } = values;
  const query = `/update/id=${id}/number=${number}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    console.log(request);
    return request
      .then(({ data }) => {
    console.log(request);
        
        dispatch({
          type: EDIT_FLOOR,
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

export function deleteFloor(id) {
  const query = `/delete/${id}`;
  const url = `${URL}${query}`;
  const request = axios.delete(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_FLOOR,
        payload: id
      });
    });
  };
}