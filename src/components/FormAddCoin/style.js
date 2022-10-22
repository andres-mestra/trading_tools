import { Box, Button, styled } from '@mui/material'

export const Container = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr) min-content;
  grid-template-rows: min-content repeat(2, 1fr);
  align-items: center;
  gap: 0.5rem;
`

export const ButtonAdd = styled(Button)`
  align-self: end;
  grid-row: 1 / 4;
  grid-column: -2 /-1;
  max-width: min-content;
  height: 70%;
`
