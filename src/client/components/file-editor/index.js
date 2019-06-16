import React, { useState } from 'react'
import { connect } from 'react-redux'

import { UnmountClosed as Collapse } from 'react-collapse'
import { ProtectedRequestForm } from '../protected-request-form'

import EditIcon from './pencil.svg'
import CloseIcon from './close.svg'

import './index.scss'

const mapDispatchToProps = (dispatch, { fileId, editor }) => {
  return {
    edit: (data) => dispatch(editor(fileId, data))
  }
}

export const FileEditor = connect(null, mapDispatchToProps)(({
  fileId,
  files,
  inputs,
  edit
}) => {
  const [ formOpen, setFormOpen ] = useState(false)

  return (
    <div className="file-editor">
      <button
        className="edit-btn"
        onClick={() => setFormOpen(!formOpen)}
      >
        {
          formOpen
            ? (<CloseIcon width={30} />)
            : (<EditIcon width={30} />)
        }
      </button>
      <Collapse
        isOpened={formOpen}
        theme={{
          container: 'edit-menu'
        }}
      >
        <div
          className="edit-menu-content"
        >
          <ProtectedRequestForm
            formId={fileId}
            formClass="edit-form"
            error={files.error}
            isLoading={files.isUpdating}
            request={edit}
            inputs={inputs}
          />
        </div>
      </Collapse>
    </div>
  )
})
