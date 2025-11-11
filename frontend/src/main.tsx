import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App.tsx'
import Layout from './pages/Layout.tsx'
import Home from './pages/Home.tsx'
import Map from './pages/Map.tsx'
import Testpage from './pages/Testpage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <Navigate to="/home" replace />
          },
          {
            path: "/map",
            element: <Map />
          }
        ]
      },

      {
        path: "/home",
        element: <Home />
      },

      {
        path: "/test",
        element: <Testpage />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
