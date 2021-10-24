import React from 'react'
import Sidebar from './Sidebar'
// - [ ] ::TODO:: NBN: this file Needs a Better Name.

export default function({ children }) {
  return (
    <div>
      <Sidebar>
        {children}
      </Sidebar>
    </div>
  )
}