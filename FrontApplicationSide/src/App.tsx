import { useState, useEffect, useCallback } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthRouter } from './routes/authRouter';
import { MainRouter } from './routes/mainRouter';
import axios from 'axios';
import { useAuthStore } from './store/authStore';

function App() {

  const { isAuthenticated } = useAuthStore();

  return (
    <Box w="100vw" h="100vh">
      <Suspense fallback={<p>Loading .... </p>}>
        <RouterProvider router={isAuthenticated ? MainRouter : AuthRouter} />
      </Suspense>
    </Box>
  )
}

export default App
