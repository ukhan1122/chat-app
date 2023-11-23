import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
// import { ChatProvider } from './Component/Chatcontext'; 
import { AuthProvider } from './Component/Auth';
import { SearchProvider } from './Component/Chatcontext';

ReactDOM.render(
  <Router>
    <AuthProvider>
      <SearchProvider>  {/* Use ChatProvider here */}
        <App />
      </SearchProvider>
    </AuthProvider>
  </Router>,
  document.getElementById('root')
);
