import axios from "axios";

import { ROOT_URL, UPLOAD_FILE } from "../constants/ActionTypes";

export function uploadFile(file, dest, id) {
  const url = `${ROOT_URL}/file_upload/${dest}/${id}`;
  const request = axios.post(url, file);

  return dispatch => {
    return request.then(({ data }) => {
      dispatch({
        type: UPLOAD_FILE,
        payload: request
      });
    });
  };
}
