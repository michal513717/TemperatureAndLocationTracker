import react from 'react';

export const InfoWindow = ({closeHandler}:any) => {
    
    const infoWindowStyle = {
      position: 'relative',
      bottom: 150,
      left: '-45px',
      width: 220,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };
    
    return (
      //@ts-ignore
      <div style={infoWindowStyle}>
        <div style={{ fontSize: 16 }}>
          Lorem, ipsum.
        </div>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: 'grey' }}>
            Lorem ipsum dolor sit amet.
            {' '}
          </span>
          <span style={{ color: 'orange' }}>
            5
          </span>
          <span style={{ color: 'lightgrey' }}>
            5
          </span>
        </div>
        <div style={{ fontSize: 14, color: 'grey' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut quam maiores veniam hic eius praesentium architecto, autem iusto cumque laborum. Accusantium, eligendi libero similique quaerat aliquid est perspiciatis doloribus consectetur.
        </div>
        <div style={{ fontSize: 14, color: 'grey' }}>
          Lorem ipsum dolor sit amet.
        </div>
        <div style={{ fontSize: 14, color: 'green' }}>
          Open
        </div>
      </div>
    );
  };
  