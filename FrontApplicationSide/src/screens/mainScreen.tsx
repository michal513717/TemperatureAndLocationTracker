import React, { useEffect, useRef, useState } from 'react'
import GoogleMap from "google-maps-react-markers";
import point from "@/assets/pointer.png";
import { MarkerPoint } from "@/components/MarkerPoints";
import { Marker } from "@/components/Marker";
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { getAccessToken } from '@/store/localStorage/localStorage';
import { Point } from '@/models/points.models';
import { APPLICATION_CONFIG } from '@/configs';

function mainScreen() {

  const defaultProps = {
    center: {
      lat: 33.99835602,
      lng: 33.01502627
    },
    zoom: 11
  };

  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const [points, setPoints] = useState<Point[]>([]);

  const onGoogleApiLoaded = ({ map, maps }: any) => {
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

  const coordinates = [{lat: 50.092442, lng: 19.978649, name:"444444444444"}, {lat: 10, lng: 11, name:"4444444444444444444444444444"}]
  console.log(points)
  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative'}}>
      <GoogleMap
        apiKey={APPLICATION_CONFIG.API_KEY}
        defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }}
        defaultZoom={5}
        options={defaultProps}
        mapMinHeight="100vh"
        onGoogleApiLoaded={onGoogleApiLoaded}
      >
        {
          points.map((item: Point, index) => {
            return (
              //@ts-ignore All children which contains attribute lat i lng
              <MarkerPoint key={index} lat={item.localization.latitude} lng={item.localization.longitude}/>
              )
            })
          }
      </GoogleMap>
      <Button pos="absolute" top="2.5" left ="200" bg="white" color="black" onClick={handleAddPoint}> Add current point </Button>

    </div>
  )
}

export default mainScreen;