import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="content">
          <Routes>
            <Route path="/" element = {<HomePage/>} />
            <Route path="/login" element = {<LoginPage/>} />
            <Route path="/register" element = {<RegistrationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
