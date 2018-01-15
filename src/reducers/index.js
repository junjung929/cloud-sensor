import { combineReducers } from "redux";
import counter from "./counter";
import HospitalsReducer from "./reducer_hospitals";
import FloorsReducer from "./reducer_floors";
import RoomsReducer from "./reducer_rooms";
import BedsReducer from "./reducer_beds";
import PatientsReducer from "./reducer_patients";
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
  counter,
  hospitals: HospitalsReducer,
  floors: FloorsReducer,
  rooms: RoomsReducer,
  beds: BedsReducer,
  patients: PatientsReducer,
  form: formReducer
});

export default rootReducer;
