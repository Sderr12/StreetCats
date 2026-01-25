import { Outlet } from 'react-router-dom'
import { useEffect } from "react"

const App = () => {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return (
    <div className="h-dvh flex">
      <Outlet />
    </div>
  )
}

export default App
