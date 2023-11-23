import React, { useEffect, useState } from 'react';
import { Phone, VideoCall } from '@mui/icons-material';
import './Rightslider.css';
import Message from './Message';
import { useSearchContext } from './Chatcontext';
import Messagedisplay from './Messagedisplay';

const Rightslider = () => {
  const { selectedUsers } = useSearchContext();
  const [isActive, setIsActive] = useState(false);


  // Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  useEffect(() => {
    // Use setTimeout to toggle the 'active' class after a delay
    const timeout = setTimeout(() => {
      setIsActive(true);
    }, 1000); // Adjust the delay as needed

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Check if selectedUsers exists
  if (!selectedUsers) {
    return <div>No user selected.</div>;
  }

  return (
    <div className={`rightslider ${isActive ? 'active' : ''}`}>
      <div className="Friend">
        <div className="Friend-name">
         {capitalizeFirstLetter(selectedUsers.name)} 
        </div>

        <div className="user-Profile-message">
  <img src={selectedUsers.photoURL} alt="User" className="user-photo" />
 
 
</div>


        <div className="Friend-Transimmison">
          <div className="video">
            <VideoCall />
          </div>
          <div className="voice">
            <Phone />
          </div>
          <div className="three-dot">...</div>
        </div>
      </div>
      <div className='messagedisplay'>
        <Messagedisplay />
      </div>
      <div className="message-component">
        <Message />
      </div>
    </div>
  );
};

export default Rightslider;
