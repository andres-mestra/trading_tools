'use client'

import { OraculoApp } from 'components/OraculoApp'

export default function DosOnePage() {
  return (
    <OraculoApp
      isTwoOne={true}
      title="Dos a uno"
      longKeyStorage="long_data_dosuno"
      shortKeyStorage="'short_data_dosuno"
    />
  )
}
