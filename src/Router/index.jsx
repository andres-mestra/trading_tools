import { Routes, Route } from 'react-router-dom'
import { Home, Oraculo } from '../pages'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oraculo" element={<Oraculo />} />
    </Routes>
  )
}
