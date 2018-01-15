import axios from "axios";

import { ROOT_URL, FETCH_SENSOR_DATA } from "../constants/ActionTypes";

export function fetchSensorData(node) {
  const query = `/sensor=${node}`;
  const url = `${ROOT_URL}/data/push${query}`;
  const request = axios.get(url);
  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: FETCH_SENSOR_DATA,
        payload: data
      });
    });
  };
}
