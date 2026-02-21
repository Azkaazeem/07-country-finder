import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './Pages/Home.jsx'
import CountryDetails from './Pages/CountryDetails.jsx'
import NotFound from './Pages/NotFound.jsx'
import ErrorPage from './Pages/ErrorPage.jsx'
import Auth from './Pages/Auth.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App ke andar Header aur Outlet hai
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/country/:name", element: <CountryDetails /> }
    ]
  },
  {
    // Auth route ko App se bahar rakha hai taake Header show na ho
    path: "/auth",
    element: <Auth />
  },
  {
    path: "*",
    element: <NotFound />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)