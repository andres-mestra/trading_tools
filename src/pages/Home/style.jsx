import { Paper, Typography, styled } from '@mui/material'

export const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 100vh;
  width: 100%;
`

export const Brand = styled(Typography)`
  background: linear-gradient(to right, #007fff, #0059b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
