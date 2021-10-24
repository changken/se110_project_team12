import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from '../routes/AllRoutes'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AllRoutes/>
      </BrowserRouter>
    </div>
  )
}
