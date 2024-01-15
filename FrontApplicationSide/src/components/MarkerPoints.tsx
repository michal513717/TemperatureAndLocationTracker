import React, { useState } from "react";
import styled from "styled-components";
import { Image } from "@chakra-ui/react";
import { InfoWindow } from "./InfoWindow";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import point from "@/assets/point.png";

const WrapperItem = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const Item = styled.button`
  background: white;
  box-shadow: 0px 5px 15px rgba(77, 77, 77, 0.3);
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 4px;

  color: gray;
  margin: 0 auto;
  cursor: pointer;
  &.active-type-style {
    background: black;
    color: white;
  }
`;

const Percent = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  border: 1px solid red;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const MarkerPoint = () => {
  const [hideCardItem, setHideCardItem] = useState(false);

  const handleHeaderClick = () => {
    setHideCardItem(false)
  };

  const ref = useOutsideClick(handleHeaderClick);

  return ( 
    //@ts-ignore
    <WrapperItem ref={ref}>
      <Item
        className={hideCardItem ? "active-type-style" : ""}
        onClick={() => setHideCardItem(!hideCardItem)}
      >
        <IconWrapper>
          <Image src={point}/>
        </IconWrapper>
      </Item>
     {hideCardItem && (
				<InfoWindow
					// title="Macdonald’s"
					// subtitle="1.50 км от вас"
					// percent="5%"
					// img="../../img/partners/Mac.jpg"
					// logo="../../img/partners/LogoMac.png"
					closeHandler={() => setHideCardItem(!hideCardItem)}
				/>
			)}
    </WrapperItem>
  );
};