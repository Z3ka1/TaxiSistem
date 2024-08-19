import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';



const HomePage = () => {
  const[user, setUser] = useState(null);
  const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);
}, []);

  useEffect(() => {
    if (!user) return;

    
  const fetchDriverVerificationStatus = async (driverId) => {
    try
    {
        const response = await fetch(`${communicationServiceUrl}/getVerificationStatus/${driverId}`);

        if(!response.ok) {
            throw new Error('Failed to update ride status to ongoing');
        }
        const data = await response.text();
        if(user.verificationStatus !== data)
        {
            user.verificationStatus = data;
            sessionStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/';
        }

    } catch(err) {
      
    }
  };

    if(user && user.userType === 2)
      fetchDriverVerificationStatus(user.id);

    if(user) {
      console.log('Logged in as: ' + user.username);
    }

  }, [user]);  
  

  
  return (
      <div>
        <h1>Taksi udruzenje</h1>
        {user ? ( <p>Welcome to taxi application. You are logged in as: {user.username}.</p>) 
        : (<p>Welcome to taxi application. Please log in or register.</p>)}
      </div>
    );

  };
  
  export default HomePage;