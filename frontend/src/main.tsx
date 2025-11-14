import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthProvider.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App.tsx'
import Layout from './pages/Layout.tsx'
import Home from './pages/Home.tsx'
import Map from './pages/Map.tsx'
import Testpage from './pages/Testpage.tsx'
import Spot from './pages/Spot.tsx'
import ProtectedRoute from './context/ProtectedRoute.tsx'
import Login from './pages/Login.tsx'


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
          },
          {
            path: "/spot",
            element: (
              <ProtectedRoute>
                <Spot />
              </ProtectedRoute>
            )
          }
        ]
      },

      {
        path: "/login",
        element: <Login />
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
