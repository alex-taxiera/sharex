import React from 'react'
import { connect } from 'react-redux'

import { classname } from '../../utils/classname'

import './index.scss'

const mapDispatchToProps = (dispatch, { files, loader }) => {
  return {
    tail: () => dispatch(
      files.data.length > 0
        ? loader(files.data[files.data.length - 1].id)
        : loader()
    ),
    head: () => dispatch(
      files.data.length > 0
        ? loader(files.data[0].id, { tail: false })
        : loader({ tail: false })
    )
  }
}

export const FileLoader = connect(null, mapDispatchToProps)(({
  className,
  head,
  tail,
  files,
  moreStyle = {},
  display = (file, key) => (<div className="file" key={key}>{file.name}</div>)
}) => {
  const {
    isFetching,
    error,
    end,
    data
  } = files

  return (
    <>
      <div
        className="refresh-btn"
      >
        <button
          onClick={head}
          disabled={isFetching}
        >
          {
            isFetching
              ? 'Loading...'
              : 'Refresh'
          }
        </button>
      </div>
      <div className={classname('file-loader', className)}>
        {
          data.map(display)
        }
        {
          error
            ? (<div>Error: {error.message}</div>)
            : null
        }
      </div>
      <div
        className="more-btn"
      >
        <button
          onClick={tail}
          disabled={end || isFetching}
          style={moreStyle}
        >
          {
            isFetching
              ? 'Loading...'
              : end
                ? 'Nothing Found'
                : 'More'
          }
        </button>
      </div>
    </>
  )
})
