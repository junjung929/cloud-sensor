import _ from 'lodash'
import { FETCH_BED, FETCH_SENSOR_DATA } from '../constants/ActionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_SENSOR_DATA:
      return { ...state, sensor_data: action.payload }
    case FETCH_BED:
      return { ...state, bed: action.payload }

    default:
      return state
  }
}
