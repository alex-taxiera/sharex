import React from 'react'
import { connect } from 'react-redux'

import {
  fetchPastes,
  putPaste
} from '../../redux/operations'

import { SEO } from '../../components/seo'
import { FileLoader } from '../../components/file-loader'
import { FileEditor } from '../../components/file-editor'

import './index.scss'

function Pastes ({ pastes }) {
  return (
    <div className="pastes">
      <SEO
        title="Pastes"
      />
      <FileLoader
        className="paste-files"
        files={pastes}
        loader={fetchPastes}
        display={(paste, key) => (
          <div className="paste" key={key}>
            <a
              href={paste.name}
              target="_blank"
            >
              {paste.title}
            </a>
            <FileEditor
              files={pastes}
              fileId={paste.id}
              editor={putPaste}
              inputs={[
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                  value: paste.title,
                  isRequired: true
                }
              ]}
            />
          </div>
        )}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    pastes: state.pastes
  }
}

export default connect(mapStateToProps)(Pastes)
