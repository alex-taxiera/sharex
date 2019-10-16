import React from 'react'
import { connect } from 'react-redux'
import loadable from '@loadable/component'

import { fetchLinks } from '../../redux/operations'

import { SEO } from '../../components/seo'
import { FileLoader } from '../../components/file-loader'
import { CopyButton } from '../../components/copy-button'

import './index.scss'

function Links ({ links }) {
  return (
    <div className="links">
      <SEO
        title="Links"
      />
      <FileLoader
        className="link-files"
        files={links}
        loader={fetchLinks}
        display={(link, key) => (
          <div className="link" key={key}>
            <a
              href={link.name.split('.')[0]}
              target="_blank"
            >
              {link.url}
            </a>
            <CopyButton
              wrapperClass="copy-btn-links"
              hiddenText={
                typeof window !== 'undefined'
                  ? `${window.location.origin}/${link.name.split('.')[0]}`
                  : ''
              }
            />
          </div>
        )}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    links: state.links
  }
}

export default connect(mapStateToProps)(Links)
