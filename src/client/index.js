import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { loadableReady } from '@loadable/component'

import { App } from './app'
import { createStore } from './redux'

import './reset.scss'

loadableReady(() => hydrate(
  <HelmetProvider>
    <Provider store={createStore(window.__REDUX__)}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </HelmetProvider>,
  document.getElementById('app')
))
