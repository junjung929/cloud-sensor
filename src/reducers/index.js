import { combineReducers } from "redux";
import HospitalsReducer from "./reducer_hospitals";
import FloorsReducer from "./reducer_floors";
import RoomsReducer from "./reducer_rooms";
import BedsReducer from "./reducer_beds";
import PatientsReducer from "./reducer_patients";
import SensorsReducer from "./reducer_sensors";
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
  hospitals: HospitalsReducer,
  floors: FloorsReducer,
  rooms: RoomsReducer,
  beds: BedsReducer,
  patients: PatientsReducer,
  sensors: SensorsReducer,
  form: formReducer
});

export default rootReducer;
