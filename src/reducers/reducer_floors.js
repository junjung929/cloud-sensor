import { FETCH_ROOMS_AT, FETCH_FLOOR } from "constants/ActionTypes";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_FLOOR:
      return { ...state, floor: action.payload };
    case FETCH_ROOMS_AT:
      return { ...state, rooms_at: action.payload };
    default:
      return state;
  }
}
