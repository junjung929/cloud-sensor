import axios from "axios";

import {
  ROOT_URL,
  FETCH_ROOMS_AT,
  FETCH_ROOM,
  ADD_ROOM,
  EDIT_ROOM,
  DELETE_ROOM,
  ADD_BED_AT,
  DELETE_BED_AT
} from "../constants/ActionTypes";

const URL = `${ROOT_URL}/api/rooms`;

export function fetchRoomsAt(id) {
  const query = `/floor=${id}`;
  const url = `${URL}${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_ROOMS_AT,
        payload: data
      });
    });
  };
}
export function fetchRoom(id) {
  const query = `/id=${id}`;
  const url = `${URL}${query}`;
  const request = axios.get(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_ROOM,
        payload: data
      });
    });
  };
}
// post
export function addRoom(values, file) {
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
        type: ADD_ROOM,
        payload: data
      });
      return data;
    });
  };
}
export function editRoom(id, values, file) {
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
          type: EDIT_ROOM,
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

export function deleteRoom(id) {
  const query = `/delete/${id}`;
  const url = `${URL}${query}`;
  const request = axios.delete(url);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_ROOM,
        payload: id
      });
    });
  };
}

export function addBedAt(id, bedId) {
  const query = `/add_bed/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, bedId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_BED_AT,
        payload: id
      });
    });
  };
}
export function deleteBedAt(id, bedId) {
  const query = `/delete_bed/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, bedId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_BED_AT,
        payload: id
      });
    });
  };
}
