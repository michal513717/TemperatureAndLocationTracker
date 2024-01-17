import react from 'react';
import { Point } from "@/models/points.models"

export const InfoWindow = ({ author, localization, timeStamp, humidity, temperature }: Point) => {
    
    const infoWindowStyle = {
      position: 'relative',
      // bottom: 150,
      left: '-240px',
      width: 240,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };

    console.log("first")
    function getDate() {
      const date = new Date(timeStamp._seconds * 1000);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();

      const hour = date.getHours();
      const min = date.getMinutes();
      const sec = date.getSeconds();

      return `${month}/${day}/${year} ${hour}:${min}:${sec}`;
    }

    return (
      //@ts-ignore
      <div style={infoWindowStyle}>
        <div style={{ fontSize: 14 }}>
          <p style={{ color: 'grey' }}>
            Latitude: { localization.latitude }
          </p>
          <p style={{ color: 'orange' }}>
            Longtitude: { localization.longitude }
          </p>
          <p style={{ color: 'lightgrey' }}>
            Author: { author }
          </p>
        </div>
        <div style={{ fontSize: 14, color: 'grey' }}>
          Temperature: { temperature }
        </div>
        <div style={{ fontSize: 14, color: 'grey' }}>
          Humidity: { humidity }
        </div>
        <div style={{ fontSize: 14, color: 'green' }}>

          Created at: { getDate() }
        </div>
      </div>
    );
  };
  