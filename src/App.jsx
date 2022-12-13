import { GlobalStyles, ThemeGlobal } from './theme/ThemeGlobal'
import { Home } from './pages/Home'

function App() {
  return (
    <ThemeGlobal>
      <GlobalStyles />
      <Home />
    </ThemeGlobal>
  )
}

export default App
