import React from 'react'
import { NavLink } from 'react-router-dom'

import { Nav } from '../nav'

import './index.scss'

export function Header () {
  return (
    <header
      className="header"
    >
      <h1>
        <NavLink
          exact
          to="/"
        >
          Simple ShareX Server
        </NavLink>
      </h1>
      <Nav />
    </header>
  )
}
