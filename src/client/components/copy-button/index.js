import React from 'react'

import CopyIcon from './copy.svg'
import { classname } from '../../utils/classname'

import './index.scss'

export function CopyButton ({
  wrapperClass,
  hiddenText
}) {
  const copy = (e) => {
    const el = document.createElement('textarea')
    el.value = hiddenText
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    e.target.focus()
  }

  return (
    <div
      className={classname('copy-btn-wrapper', wrapperClass)}
    >
      <button
        className="copy-btn"
        onClick={copy}
      >
        <CopyIcon width={30} />
      </button>
    </div>
  )
}
