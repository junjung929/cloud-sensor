import { combineReducers } from 'redux'
import counter from './counter'
import HospitalsReducer from './reducer_hospitals';
import PatientsReducer from './reducer_patients';

const rootReducer = combineReducers({
  counter,
  hospitals: HospitalsReducer,
  patients: PatientsReducer,
})

export default rootReducer
