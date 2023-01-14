import { GlobalStyles, ThemeGlobal } from './theme/ThemeGlobal'
import { Router } from './Router'

function App() {
  return (
    <ThemeGlobal>
      <GlobalStyles />
      <Router />
    </ThemeGlobal>
  )
}

export default App
