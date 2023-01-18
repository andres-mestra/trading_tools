'use client'

import { useState } from 'react'
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { SimpleBackdrop } from 'components/SimpleBackdrop'
import { useRouter } from 'next/navigation'

export default function VipPage() {
  const router = useRouter()
  const [loading, setloading] = useState(false)
  const [error, setError] = useState(null)
  const [code, setCode] = useState('')

  async function onValidateCode() {
    setloading(true)
    try {
      const resp = await fetch('/api/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await resp.json()

      if (data.isVIP) {
        localStorage.setItem('isVIP', true)
        router.push('/oraculo')
      } else {
        localStorage.removeItem('isVIP')
        setError('Código invalido')
      }
      setloading(false)
    } catch (error) {
      localStorage.removeItem('isVIP')
      setError(error?.message)
      setloading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onValidateCode()
  }

  return (
    <>
      {loading && <SimpleBackdrop />}
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '2rem',
          height: '100vh',
          width: '100%',
        }}
      >
        <Typography variant="h1" fontWeight="400">
          VIP
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack gap={2}>
            <TextField
              required
              label="Código de acceso"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <Button type="submit">Validar</Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </form>
      </Paper>
    </>
  )
}
