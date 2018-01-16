import _ from "lodash";
import { FETCH_BEDS_AT, FETCH_ROOM } from "constants/ActionTypes";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_ROOM:
      return { ...state, room: action.payload };
    case FETCH_BEDS_AT:
      return { ...state, beds_at: action.payload };

    default:
      return state;
  }
}
