import React, { createContext, useContext, useEffect, useState } from 'react';
import './Login.css'; // Import your CSS file here
import { useHistory } from 'react-router-dom';
import {  signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication functions
import { AuthContext } from '../Auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { auth } from '../Signup/Firebas';

const db = getFirestore(); // Initialize Firestore

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  
  const{loginuser} = useContext(AuthContext)

  
  


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

  
  
      try {
        
      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);
        
      // Redirect to the home page after successful login
      history.push('/');
      } catch (error) {
        console.log(error)
        
        
      }
  
    } 
     
  
  return (
    <div className="login-container">
      <div className='app-name'>
    <h1>
      <span>H</span>
      <span>o</span>
      <span>n</span>
      <span>g</span>
      <span>o</span>
    </h1>
  </div>
  
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>   
         <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;
