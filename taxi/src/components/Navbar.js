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
        <Link to="/">Pocetna</Link>
        {user == null && (<Link to="/login">Prijava</Link>)}
        {user == null && (<Link to="/register">Registracija</Link>)}
        {user && (<Link to="/profile">Profile</Link>)}
        {user != null && user.userType == 0 && (<Link to ="/verification">Driver Verification</Link>)}

        {user && (<button class='logout' onClick={handleLogout}>Logout</button>)}
      </div>
    </nav>
  );
}
 
export default Navbar;