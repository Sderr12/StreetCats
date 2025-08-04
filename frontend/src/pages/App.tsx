import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-blue-300 text-white p-3 rounded-lg">
      Hello!
    </div>
  )
}

export default App
