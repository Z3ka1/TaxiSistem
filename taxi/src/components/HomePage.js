import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const HomePage = () => {
  const[user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);
    console.log(storedUser);

    if(storedUser) {
      console.log('Logged in as: ' + storedUser.username);
    }

  }, []);  
  
  
  return (
      <div>
        <h1>Taksi udruzenje</h1>
        {user ? ( <p>Welcome to taxi application. You are logged in as: {user.username}.</p>) 
        : (<p>Welcome to taxi application. Please log in or register.</p>)}
      </div>
    );
  };
  
  export default HomePage;