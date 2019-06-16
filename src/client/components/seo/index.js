import React from 'react'
import { Helmet } from 'react-helmet-async'

import manifest from '../../../manifest.json'

export function SEO ({
  title,
  keywords = []
}) {
  return (
    <Helmet
      title={title}
      meta={[
        {
          name: 'twitter:title',
          content: `${manifest.short_name} | ${title}`
        },
        {
          property: 'og:title',
          content: `${manifest.short_name} | ${title}`
        },
        {
          name: 'keywords',
          content: manifest.keywords.concat(keywords).join(', ')
        }
      ]}
    />
  )
}
