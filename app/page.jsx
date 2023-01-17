'use client'

import { Alert, Button, Paper, Typography } from '@mui/material'
import { OgtLink } from 'components/OgtLink'
import { useAuthConext } from 'context/AuthContext'

export default function HomePage() {
  const {
    error,
    active,
    account,
    hasMinOGT,
    networkName,
    connect,
    disconnect,
    vefiryOgtAmount,
  } = useAuthConext()

  return (
    <Paper className="container_paper" sx={{ textAlign: 'center' }}>
      <Typography className="brand" variant="h1" fontWeight="bold">
        Trading tools
      </Typography>
      <Typography variant="h3" fontWeight="bold">
        Spartans
      </Typography>
      {active ? (
        <>
          <Button variant="outlined" onClick={disconnect}>
            Desconectar wallet
          </Button>
          <Alert severity="success">Conectado con {networkName}</Alert>
          <Alert severity="info">Tu dirección: {account}</Alert>
          {!hasMinOGT && (
            <>
              <Button variant="outlined" size="small" onClick={vefiryOgtAmount}>
                Verificar Balance de OGT
              </Button>
              <Alert severity="warning">
                Debes verificar la cantidad de OGT que tienes en la wallet o no
                tienes lo equivalente a 1 USDT
              </Alert>
            </>
          )}
        </>
      ) : (
        <>
          <Button variant="outlined" onClick={connect}>
            Conectar wallet
          </Button>
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            Para acceder a las herramientas debes conectar tu wallet
            <br />
            Ademas tener en tu billetera una cantidad de <OgtLink /> equivalente
            a 1 USDT
          </Alert>
          {error && <Alert severity="error">{error.message}</Alert>}
        </>
      )}
    </Paper>
  )
}
