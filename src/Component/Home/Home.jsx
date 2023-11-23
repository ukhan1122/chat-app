

import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import './Home.css';
import Leftslider from '../Leftslider';
import Rightslider from '../Rightslider';

const Home = () => {
  const [initialAnimation, setInitialAnimation] = useState(true);

  useEffect(() => {
    // Use setTimeout to initiate the animation after a delay (e.g., 1 second)
    const timer = setTimeout(() => {
      setInitialAnimation(false);
    }, 1000);

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='centered-container'>
      <Paper elevation={3} className="paper-container">

        <Leftslider className={initialAnimation ? 'left-slider initial-animation' : 'left-slider'} />
        <Rightslider />
      </Paper>
    </div>
  );
};

export default Home;