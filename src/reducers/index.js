import { combineReducers } from "redux";
import counter from "./counter";
import HospitalsReducer from "./reducer_hospitals";
import PatientsReducer from "./reducer_patients";
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
  counter,
  hospitals: HospitalsReducer,
  patients: PatientsReducer,
  form: formReducer
});

export default rootReducer;
