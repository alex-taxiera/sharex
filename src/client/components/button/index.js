import React from 'react'

import { classname } from '../../utils/classname'

import './index.scss'

export function Button ({
  buttonClass,
  wrapperClass,
  onClick,
  children
}) {
  return (
    <div
      className={classname('styled-button-wrapper', wrapperClass)}
    >
      <button
        className={buttonClass}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  )
}
