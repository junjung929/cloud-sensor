import axios from "axios";

import {
  ROOT_URL,
  FETCH_ROOMS_AT,
  FETCH_ROOM,
} from "../constants/ActionTypes";

export function fetchRoomsAt(id) {
    const query = `/floor=${id}`;
    const url = `${ROOT_URL}/api/rooms${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_ROOMS_AT,
          payload: data
        });
      });
    };
  }
  export function fetchRoom(id) {
    const query = `/id=${id}`;
    const url = `${ROOT_URL}/api/rooms${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_ROOM,
          payload: data
        });
      });
    };
  }