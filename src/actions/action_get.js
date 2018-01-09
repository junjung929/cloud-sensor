import axios from "axios";

import {
  ROOT_URL,
  FETCH_HOSPITALS,
  FETCH_HOSPITAL,
  FETCH_FLOORS_AT,
  FETCH_FLOOR,
  FETCH_ROOMS_AT,
  FETCH_ROOM,
  FETCH_BEDS_AT,
  FETCH_BED,
  FETCH_PATIENTS,
  FETCH_PATIENT,
  FETCH_PATIENTS_SEACHED,
  FETCH_SENSOR_DATA
} from "../constants/ActionTypes";

export function fetchHospitals() {
  const url = `${ROOT_URL}/api/hospitals`;
  const request = axios.get(url);

  return dispatch => {
    request.then(({ data }) => {
      dispatch({
        type: FETCH_HOSPITALS,
        payload: data
      });
    });
  };
}
export function fetchHospital(id) {
  const query = `/id=${id}`;
  const url = `${ROOT_URL}/api/hospitals${query}`;
  const request = axios.get(url);

  return dispatch => {
    request.then(({ data }) => {
      dispatch({
        type: FETCH_HOSPITAL,
        payload: data
      });
    });
  };
}
export function fetchFloorsAt(id) {
    const query = `/hospital=${id}`;
    const url = `${ROOT_URL}/api/floors${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
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
      request.then(({ data }) => {
        dispatch({
          type: FETCH_FLOOR,
          payload: data
        });
      });
    };
  }
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
  export function fetchPatients() {
    const url = `${ROOT_URL}/api/patients`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_PATIENTS,
          payload: data
        });
      });
    };
  }
  export function fetchPatient(id) {
    const query = `/id=${id}`;
    const url = `${ROOT_URL}/api/patients${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_PATIENT,
          payload: data
        });
      });
      return request.then(response => {
        return response;
      });
    };
  }
  export function fetchPatientsSearched(searchByName) {
    const query = `/searchByName=${searchByName}`;
    const url = `${ROOT_URL}/api/patients${query}`;
    const request = axios.get(url);
  
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_PATIENTS_SEACHED,
          payload: data
        });
      });
    };
  }
  export function fetchSensorData(node) {
    const query = `/sensor=${node}`;
    const url = `${ROOT_URL}/data/push${query}`;
    const request = axios.get(url);
    return dispatch => {
      request.then(({ data }) => {
        dispatch({
          type: FETCH_SENSOR_DATA,
          payload: data
        });
      });
      return request.then(response => {
        return response;
      });
    };
  }