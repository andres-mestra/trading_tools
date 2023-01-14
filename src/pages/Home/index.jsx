import { Typography } from '@mui/material'
import { Brand, Container } from './style'

export function Home() {
  return (
    <Container>
      <Brand variant="h1" fontWeight="bold">
        Trading tools
      </Brand>
      <Typography variant="h3" fontWeight="bold">
        Spartans
      </Typography>
    </Container>
  )
}
