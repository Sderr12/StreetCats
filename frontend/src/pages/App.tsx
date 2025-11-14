import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const App = () => {

  return (
    <div className="h-dvh overflow-hidden flex flex-col">
      <Outlet />
    </div>
  )
}

export default App
