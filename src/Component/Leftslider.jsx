import React, { useContext, useState, useEffect } from 'react';
import './Leftslider.css';
import Person from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './Auth';
import Search from './Signup/Search';

const Leftslider = () => {
  const history = useHistory();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { loginuser } = useContext(AuthContext);


  
// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  

  const handleLogout = () => {
    // Perform the logout action here, e.g., sign out the user
    // After logout, redirect to the login page
    history.push('/login');
  };
  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className={`leftslider ${isDropdownOpen ? '' : 'closed'}`}>
      <div className="user-information">
        <div className="App-name">Hango</div>
        <div className="Profile">
        <div className="user-profile">
          {loginuser && loginuser.photoURL ? (
            
        <img src={loginuser.photoURL} alt="User Profile" />

          ):
          (<Person/>)
          }
          
          </div>
          <div className="user-name-login">
           {capitalizeFirstLetter(loginuser ? loginuser.displayName : 'Guest')} 
          </div>
          <div className="user-dot">
            <MoreVertIcon onClick={handleDropdownToggle} />
            {isDropdownOpen && (
              <div className="dropdown-content ">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
   <Search className="Search-component"/>
      
    </div>
  );
};

export default Leftslider;
