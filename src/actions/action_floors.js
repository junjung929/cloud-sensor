import axios from "axios";

import {
  ROOT_URL,
  FETCH_FLOORS_AT,
  FETCH_FLOOR,
  ADD_FLOOR,
  EDIT_FLOOR,
  DELETE_FLOOR,
  ADD_ROOM_AT,
  DELETE_ROOM_AT
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
        type: ADD_FLOOR,
        payload: data
      });
      return data
    });
  };
}
export function editFloor(id, values, file) {
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

export function deleteFloor(id, hospital_) {
  const query = `/delete/${id}`;
  const url = `${URL}${query}`;
  const config = {
    method: "delete",
    url,
    params: {hospital_}
  };
  const request = axios(config);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_FLOOR,
        payload: id
      });
    });
  };
}

export function addRoomAt(id, roomId) {
  const query = `/add_room/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, roomId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_ROOM_AT,
        payload: id
      });
    });
  };
}
export function deleteRoomAt(id, roomId) {
  const query = `/delete_room/${id}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, roomId);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: DELETE_ROOM_AT,
        payload: id
      });
    });
  };
}