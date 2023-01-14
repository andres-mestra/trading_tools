import { GlobalStyles, ThemeGlobal } from './theme/ThemeGlobal'
import { Router } from './Router'
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <ThemeGlobal>
      <GlobalStyles />
      <HashRouter>
        <Router />
      </HashRouter>
    </ThemeGlobal>
  )
}

export default App
