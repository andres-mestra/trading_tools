import { createBrowserRouter } from 'react-router-dom'
import { Home, Oraculo } from '../pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/oraculo',
    element: <Oraculo />,
  },
])
