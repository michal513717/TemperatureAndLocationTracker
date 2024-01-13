import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthRouter } from './routes/authRouter'

function App() {

  return (
    <Box w="100vw" h="100vh">
      <Suspense fallback={<p>Loading .... </p>}>
        <RouterProvider router={AuthRouter} />
      </Suspense>
    </Box>
  )
}

export default App
