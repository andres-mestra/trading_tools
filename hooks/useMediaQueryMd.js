import { useMediaQuery } from '@mui/material'

export const useMediaQueryMd = () =>
  useMediaQuery('(min-width:1000px)', { noSsr: true })
