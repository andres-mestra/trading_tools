import { RouterProvider } from 'react-router-dom'
import { GlobalStyles, ThemeGlobal } from './theme/ThemeGlobal'
import { router } from './router'

function App() {
  return (
    <ThemeGlobal>
      <GlobalStyles />
      <RouterProvider router={router} />
    </ThemeGlobal>
  )
}

export default App
