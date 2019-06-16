import React from 'react'

import { SEO } from '../../components/seo'

import './index.scss'

export default function NotFound () {
  return (
    <div className="not-found">
      <SEO
        title="404"
      />
      <h1>
        404
      </h1>
      <p>
        Sorry, the page you are looking for could not be found.
      </p>
    </div>
  )
}
