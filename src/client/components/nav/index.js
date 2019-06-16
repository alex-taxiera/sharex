import React from 'react'
import { NavLink } from 'react-router-dom'

import './index.scss'

export function Nav () {
  return (
    <div
      className="nav"
    >
      <NavLink
        to="/links"
        activeClassName="active"
      >
        <h3>
          links
        </h3>
      </NavLink>
      <NavLink
        to="/pastes"
        activeClassName="active"
      >
        <h3>
          pastes
        </h3>
      </NavLink>
      <NavLink
        to="/images"
        activeClassName="active"
      >
        <h3>
          images
        </h3>
      </NavLink>
    </div>
  )
}
