'use client'

import { OraculoApp } from 'components/OraculoApp'

export default function OraculoPage() {
  return (
    <OraculoApp
      longKeyStorage="long_data_oraculo"
      shortKeyStorage="'short_data_oraculo'"
    />
  )
}
