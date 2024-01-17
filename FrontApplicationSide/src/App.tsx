import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthRouter } from './routes/authRouter';
import { MainRouter } from './routes/mainRouter';
import axios from 'axios';
import { useAuthStore } from './store/authStore';
import { getAccessToken, setAccessToken } from './store/localStorage/localStorage';
import { APPLICATION_CONFIG } from './configs';

function App() {

  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  
  const token = getAccessToken();

  useEffect(() => {
    if(token !== ""){
      checkStatus();
    }
  },[token])

  const checkStatus = async () => {
    try {
      const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + "/basic/ping", {}, { headers: { Authorization: `Barear ${token}`} });

      if(req.status === 200){
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setAccessToken("");
      console.log(error)
    }
  }

  return (
    <Box w="100vw" h="100vh">
      <Suspense fallback={<p>Loading .... </p>}>
        <RouterProvider router={isAuthenticated ? MainRouter : AuthRouter} />
      </Suspense>
    </Box>
  )
}

export default App
