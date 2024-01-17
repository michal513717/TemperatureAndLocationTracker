import React, { useState } from "react";
import { Image, Box } from "@chakra-ui/react";
import { InfoWindow } from "./InfoWindow";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import point from "@/assets/point.png";
import { Point } from "@/models/points.models";

type Props = {
  pointData: Point
}

export const MarkerPoint = (props: Props) => {
  const [hideCardItem, setHideCardItem] = useState(false);
  const handleHeaderClick = () => {
    setHideCardItem(false)
  };

  const ref = useOutsideClick(handleHeaderClick);

  return ( //@ts-ignore
    <Box ref={ref}>
      <Box 
        cursor={"pointer"} 
        bg={"red"} 
        w={"30px"} 
        display={"flex"} 
        alignItems={"center"} 
        justifyContent={"center"} 
        h={"30px"} 
        borderRadius={"50%"}
        onClick={() => setHideCardItem(!hideCardItem)}
      >
        <Image src={point} w={4} h={6} />
      </Box>
      {hideCardItem && (
        <InfoWindow
          localization={ props.pointData.localization }
          temperature={ props.pointData.temperature }
          humidity={ props.pointData.humidity }
          author={ props.pointData.author }
          timeStamp={ props.pointData.timeStamp }
        />
      )}
    </Box>
  );
};