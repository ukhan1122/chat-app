import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './Component/Login/Login';
import Signup from './Component/Signup/Signup';
import Home from './Component/Home/Home';
import { AuthContext } from './Component/Auth';
import './App.css'

function App() {
  const { loginuser } = useContext(AuthContext); // Change here

  const ProtectedRoute = ({ children }) => {
    if (!loginuser) {
      return <Redirect to="/Login" />;
    }
    return children;
  };

  return (
    <div className="App"><div className="App-css">
    <Router>
      <Switch>
        <Route exact path="/">
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </Route>
        <Route className="login-css" exact path="/Login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
  </div></div>
    
  );
}

export default App;
