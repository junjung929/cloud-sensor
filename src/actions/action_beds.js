import axios from "axios";

import {
  ROOT_URL,
  FETCH_BEDS_AT,
  FETCH_BED,
  ADD_BED,
  EDIT_BED,
  DELETE_BED
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
  const { number, sensor_node, roomAt } = values;
  const query = `/push/number=${number}/sensor_node=${sensor_node}/roomAt=${roomAt}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_BED,
        payload: data
      });
      return data;
    });
  };
}
export function editBed(id, values, file) {
  const { number, sensor_node } = values;
  const query = `/update/id=${id}/number=${number}/sensor_node=${sensor_node}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, file);

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
