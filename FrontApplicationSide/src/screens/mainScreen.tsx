import React, { useCallback, useEffect, useRef, useState } from 'react'
import GoogleMap from "google-maps-react-markers";
import { MarkerPoint } from "@/components/MarkerPoints";
import { Button, Toast, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getAccessToken, removeAccessToken } from '@/store/localStorage/localStorage';
import { Point } from '@/models/points.models';
import { APPLICATION_CONFIG } from '@/configs';
import { useAuthStore } from '@/store/authStore';
import { MESSAGES } from '@/configs/messages';
import { ROUTES } from '@/configs/routes';

function mainScreen() {
  const mapRef = useRef(null)
  const toast = useToast();
  const [mapReady, setMapReady] = useState(false)
  const { setIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [points, setPoints] = useState<Point[]>([]);

  const onGoogleApiLoaded = ({ map }: any) => {
    mapRef.current = map
    setMapReady(true)
  }

  useEffect(() => {
    if(mapReady === true){
      handleGetPoints();
    }
  }, [mapReady])

  const handleGetPoints = async () => {
    try {
     
      const token = getAccessToken();

      const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + ROUTES.GET_POINTS, {}, { headers: { Authorization: `Barear ${token}` } });

      setPoints(req.data.result.data); 

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPoint = async () => {

    let message: string = "";

    try {
      const token = getAccessToken();

      setIsLoading(true);

      const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + ROUTES.ADD_POINTS, {}, { headers: { Authorization: `Barear ${token}` } });

      if(req.status !== 200){

        throw Error(MESSAGES.ARDUINO_SERVER_OFFLINE);
      }

      message = MESSAGES.NEW_POINT_ADDED;

      handleAddNewPoint(req.data.result.newPoint);
    
    } catch (error) {
    
      console.log(error);
    
      message = MESSAGES.ARDUINO_SERVER_OFFLINE;
    } finally {
      setIsLoading(false);

      toast({
        duration: 3000,
        title: message,
      })
    }
  }

  const handleAddNewPoint = useCallback((newPoint: Point) => {
    setPoints((prevState) => [...prevState, newPoint]);
  }, [points])

  const handleLogout = async () => {
    removeAccessToken();
    setIsAuthenticated(false);
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative'}}>
      <GoogleMap
        apiKey={APPLICATION_CONFIG.API_KEY}
        defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }}
        defaultZoom={5}
        options={{streetViewControl: false}}
        mapMinHeight="100vh"
        onGoogleApiLoaded={onGoogleApiLoaded}
      >
        {
          points.map((item: Point, index) => {
            return (
                //@ts-ignore All children which contains attribute lat i lng
                <MarkerPoint key={index} lat={item.localization.latitude} lng={item.localization.longitude} pointData={item}/>
              )
            })
          }
      </GoogleMap>
      <Button pos="absolute" top="2.5" left="200" bg="white" color="black" onClick={handleAddPoint} isLoading={isLoading}> Add current point </Button>
      <Button pos="absolute" top="2.5" left="370" bg="white" color="black" onClick={handleLogout}> Log out </Button>

    </div>
  )
}

export default mainScreen;