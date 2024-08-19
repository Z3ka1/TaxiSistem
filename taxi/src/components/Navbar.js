import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../styles/navbar.css"

const Navbar = () => {
  const[user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);

    if(storedUser) {
      console.log('Logged in as: ' + storedUser.username);
    }

  }, []);  

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <h1>Taksi sistem</h1>
      <div className="links">
        <Link to="/">Home</Link>
        {user == null && (<Link to="/login">Log in</Link>)}
        {user == null && (<Link to="/register">Register</Link>)}
        {user && (<Link to="/profile">Profile</Link>)}
        {user != null && user.userType === 0 && (<Link to ="/verification">Driver Verification</Link>)}
        {user != null && user.userType === 0 && (<Link to ="/allRides">All Rides</Link>)}
        {user != null && user.userType === 0 && (<Link to ="/driverRatings">Driver Ratings</Link>)}
        {user != null && user.userType === 1 && (<Link to ="/newRide">New ride</Link>)}
        {user != null && user.userType === 1 && (<Link to ="/previousRides">Previous rides</Link>)}
        {user != null && user.userType === 2 && user.verificationStatus === 'Approved' && (<Link to = "/createdRides">Find ride</Link>)}
        {user != null && user.userType === 2 && user.verificationStatus === 'Approved' && (<Link to ="/myDrives">My Drives</Link>)}

        {user && (<button className='logout' onClick={handleLogout}>Logout</button>)}
      </div>
    </nav>
  );
}
 
export default Navbar;