import axios from "axios";

import {
  ROOT_URL,
  FETCH_ROOMS_AT,
  FETCH_ROOM,
  ADD_ROOM,
  EDIT_ROOM,
  DELETE_ROOM
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
  const { number, room_class, roomAt  } = values;
  const query = `/push/number=${number}/room_class=${room_class}/roomAt=${roomAt}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: ADD_ROOM,
        payload: data
      });
      return data
    });
  };
}
export function editRoom(id, values, file) {
  const { number, room_class } = values;
  const query = `/update/id=${id}/number=${number}/room_class=${room_class}`;
  const url = `${URL}${query}`;
  const request = axios.post(url, file);

  return dispatch => {
    console.log(request);
    return request
      .then(({ data }) => {
    console.log(request);
        
        dispatch({
          type: EDIT_ROOM,
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