import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor} from './store/store.ts';
import App from './App.tsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
