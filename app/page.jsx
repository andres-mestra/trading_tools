'use client'


import {  Paper, Typography } from '@mui/material'
import { useEffect } from 'react'
import { getVolume } from 'services/binanceService'

export default function HomePage() {

  useEffect(() => {
    getVolume('BTC').then(console.log)
    getVolume('BTC').then(console.log)
  }, [])

  return (
    <Paper className="container_paper" sx={{ textAlign: 'center' }}>
      <Typography className="brand" variant="h1" fontWeight="bold">
        Trading tools
      </Typography>
      <Typography variant="h3" fontWeight="bold">
        Spartans
      </Typography>
     
    </Paper>
  )
}
