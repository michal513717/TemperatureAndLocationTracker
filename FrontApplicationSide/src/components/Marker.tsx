import { Image } from "@chakra-ui/react";
import img from "@/assets/pointer.png"
import { InfoWindow } from "./InfoWindow";
import { useCallback, useEffect, useState } from "react";

export const Marker = ({ show }: { show: boolean }) => {

    const [isVisible, setIsVisible] = useState(show ?? false)

    const markerStyle = {
      border: '1px solid white',
      borderRadius: '50%',
      height: 10,
      width: 10,
      backgroundColor: show ? 'red' : 'blue',
      cursor: 'pointer',
      zIndex: 10,
    };

    const handleClick = useCallback(() => {
        setIsVisible(true)
    },[isVisible])

    return (
      <>
        <div style={markerStyle} onClick={handleClick}/>
        <Image src={img} w={4} h={6}/>
        {isVisible === true ? <InfoWindow /> : <></>}
      </>
    );
  };
  