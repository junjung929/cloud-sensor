import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import Routes from './routes'
<<<<<<< HEAD
import 'styles/global-styles'
=======
import './styles/global-styles'
>>>>>>> 3a949bb02b3651485a713c8ba756a2caf926b0e1
import registerServiceWorker from './utils/registerServiceWorker'

render(
  <Provider store={configureStore()}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
