import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  
)

postMessage({ payload: 'removeLoading' }, '*')
