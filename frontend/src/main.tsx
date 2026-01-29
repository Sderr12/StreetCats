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
import CatDetails from './pages/CatDetails.tsx'
import AddCat from './pages/AddCat.tsx'
import AuthLayout from './pages/AuthLayout.tsx'
import Register from './pages/Register.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import NotFoundPage from './pages/PageNotFound.tsx'


document.documentElement.classList.add("dark")

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
            path: "/home",
            element: <Home />
          },
          {
            path: "/map",
            element: <Map />
          },
          {
            path: "/spot",
            element: (
              <ProtectedRoute>
                <AddCat />
              </ProtectedRoute>
            )
          },
          {
            path: "/catdetails/:id",
            element: <CatDetails />
          }
        ]
      },
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/register",
            element: <Register />
          }
        ]
      },
      {
        path: "/test",
        element: <Testpage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
