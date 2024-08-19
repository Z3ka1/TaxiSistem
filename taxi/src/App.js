import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ProfilePage from './components/ProfilePage';
import VerificationPage from './components/VerificationPage';
import NewRidePage from './components/NewRidePage';
import CreatedRidesPage from './components/CreatedRidesPage';
import PreviousRidesPage from './components/PreviousRidesPage';
import MyDrivesPage from './components/MyDrivesPage';
import AllRidesPage from './components/AllRidesPage';
import DriverRatingsPage from './components/DriverRatingsPage';

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
            <Route path="/profile" element = {<ProfilePage />} />
            <Route path="/verification" element = {<VerificationPage />} />
            <Route path="/newRide" element = {<NewRidePage/>}/>
            <Route path ="/createdRides" element = {<CreatedRidesPage/>}/>
            <Route path ="/previousRides" element ={<PreviousRidesPage/>}/>
            <Route path = "/myDrives" element ={<MyDrivesPage/>}/>
            <Route path = "/allRides" element = {<AllRidesPage/>} />
            <Route path = "/driverRatings" element = {<DriverRatingsPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
