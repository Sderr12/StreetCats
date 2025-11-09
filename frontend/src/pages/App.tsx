import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-dvh overflow-hidden flex flex-col">
      <Outlet />
    </div>
  )
}

export default App
