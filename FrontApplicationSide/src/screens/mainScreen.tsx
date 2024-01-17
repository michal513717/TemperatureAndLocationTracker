import React, { useEffect, useRef, useState } from 'react'
import GoogleMap from "google-maps-react-markers";
import { MarkerPoint } from "@/components/MarkerPoints";
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { getAccessToken, removeAccessToken } from '@/store/localStorage/localStorage';
import { Point } from '@/models/points.models';
import { APPLICATION_CONFIG } from '@/configs';
import { useAuthStore } from '@/store/authStore';

function mainScreen() {
  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const { setIsAuthenticated } = useAuthStore();
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

    const token = getAccessToken();

    const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + "/database/allInformation", {}, { headers: { Authorization: `Barear ${token}` } });

    setPoints(req.data.result.data);
  }

  const handleAddPoint = async () => {

    const token = getAccessToken();

    const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + "/arduino/measurement", {}, { headers: { Authorization: `Barear ${token}` } });

    console.log(req);
  }

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
      <Button pos="absolute" top="2.5" left="200" bg="white" color="black" onClick={handleAddPoint}> Add current point </Button>
      <Button pos="absolute" top="2.5" left="370" bg="white" color="black" onClick={handleLogout}> Log out </Button>

    </div>
  )
}

export default mainScreen;