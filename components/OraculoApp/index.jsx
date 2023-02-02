'use client'

import { useState } from 'react'
import { Box, Typography, Paper, Stack, Button, Tooltip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { FormAddCoin } from 'components/FormAddCoin'
import { TableCoins } from 'components/TableCoins'
import { TableCoinsItem } from 'components/TableCoinsItem'

import { SimpleBackdrop } from 'components/SimpleBackdrop'
import { useMediaQueryMd } from 'hooks/useMediaQueryMd'
import { useOraculoApp } from 'hooks/useOraculoApp'
import { FormCapital } from 'components/FormCapital'

export function OraculoApp({
  longKeyStorage,
  shortKeyStorage,
  title = 'Oraculo',
  isTwoOne = false,
}) {
  const isMd = useMediaQueryMd()
  const {
    loading,
    longs,
    shorts,
    openForm,
    isAddCoin,
    currentCoin,
    refInputImport,
    handleAddCoin,
    onFormCoin,
    onEditCoin,
    onDeleteCoin,
    onActiveNotify,
    onSetCurrentCoin,
    handleCloseForm,
    handleSubmitForm,
    handleExportPoints,
    handleImportPoints,
    handleGetTwoToOne,
  } = useOraculoApp(longKeyStorage, shortKeyStorage)
  const [toggleCapital, setToggleCapital] = useState(false)

  function onInvertion(coin) {
    setToggleCapital(true)
    onSetCurrentCoin(coin)
  }

  const containerTablesStyled = isMd
    ? { justifyContent: 'space-between' }
    : { flexWrap: 'wrap', justifyContent: 'center' }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      {loading && (
        <SimpleBackdrop>
          <Typography variant="h3">{loading}</Typography>
        </SimpleBackdrop>
      )}
      <Box
        component={Paper}
        sx={{
          margin: '0 auto',
          minHeight: '100vh',
          maxWidth: '1400px',
          p: 3,
        }}
      >
        <Stack justifyContent="center" flexWrap="wrap">
          <Stack direction="row" gap={2}>
            <Typography
              variant="h1"
              sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}
            >
              {title}
            </Typography>

            {isTwoOne ? (
              <Tooltip title="Ejecutar consulta">
                <Button variant="outlined" onClick={handleGetTwoToOne}>
                  Dos / Uno
                </Button>
              </Tooltip>
            ) : (
              <Button variant="contained" size="small" onClick={handleAddCoin}>
                Add Coin
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExportPoints}
            >
              Descargar
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                refInputImport.current && refInputImport.current.click()
              }}
            >
              <label>Cargar</label>
              <input
                hidden
                id="importPoints"
                type="file"
                accept="application/JSON"
                ref={refInputImport}
                onChange={handleImportPoints}
              />
            </Button>

            <Button variant="outlined" onClick={onActiveNotify}>
              notificar
            </Button>
          </Stack>

          {toggleCapital && (
            <FormCapital
              open={toggleCapital}
              coin={currentCoin}
              onClose={() => setToggleCapital(false)}
            />
          )}

          <FormAddCoin
            open={openForm}
            isAdd={isAddCoin}
            newCoin={currentCoin}
            onChange={onFormCoin}
            onSubmit={handleSubmitForm}
            onClose={handleCloseForm}
          />
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            sx={{ ...containerTablesStyled }}
          >
            <Stack gap={2}>
              <Typography variant="h3" color="success.light">
                Long
              </Typography>
              <TableCoins
                coins={longs}
                type="long"
                render={(coin, type, isLong, index) => (
                  <TableCoinsItem
                    key={`${coin.symbol}_${index}`}
                    type={type}
                    coin={coin}
                    isLong={isLong}
                    onDelete={() => onDeleteCoin(coin)}
                    onEdit={() => onEditCoin(coin)}
                    onUpdate={() => onUpdatePoints(coin)}
                    onInvertion={() => onInvertion(coin)}
                  />
                )}
              />
            </Stack>
            <Stack gap={2}>
              <Typography variant="h3" color="error.light">
                Short
              </Typography>
              <TableCoins
                coins={shorts}
                type="short"
                render={(coin, type, isLong, index) => (
                  <TableCoinsItem
                    key={`${coin.symbol}_${index}`}
                    type={type}
                    coin={coin}
                    isLong={isLong}
                    onDelete={() => onDeleteCoin(coin)}
                    onEdit={() => onEditCoin(coin)}
                    onUpdate={() => onUpdatePoints(coin)}
                    onInvertion={() => onInvertion(coin)}
                  />
                )}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
