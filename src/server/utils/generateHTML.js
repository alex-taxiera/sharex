import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { ChunkExtractor } from '@loadable/server'
import serialize from 'serialize-javascript'
import queryString from 'query-string'
import { join } from 'path'

import { App } from '../../client/app'
import { createStore } from '../../client/redux'

export function generateHTML (req, state) {
  const extractor = new ChunkExtractor({
    statsFile: join(__dirname, '../../../dist/loadable-stats.json'),
    entrypoints: [ 'main' ]
  })
  const store = createStore(state)
  const helmetContext = {}

  const jsx = (
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <StaticRouter
          context={{}}
          location={{
            pathname: req.url,
            search: queryString.stringify(req.query)
          }}
        >
          <App />
        </StaticRouter>
      </Provider>
    </HelmetProvider>
  )

  const html = renderToString(extractor.collectChunks(jsx))
  const { helmet } = helmetContext

  return `
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${extractor.getLinkTags()}
        ${extractor.getStyleTags()}
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="app">${html}</div>
        <script>window.__REDUX__ = ${serialize(store.getState())}</script>
        ${extractor.getScriptTags()}
      </body>
    </html>
  `
}
