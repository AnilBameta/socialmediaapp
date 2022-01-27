import './App.css';
import React from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
// import 'semantic-ui-css/semantic.min.css';
import Navbar from './Component/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
      <Route exact path='/' component={Home} />
      <Route  path='/login' component={Login} />
      <Route  path='/register' component={Register} />
      </Routes>
    </Router>
  );
}

export default App;
