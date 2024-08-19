import { useState } from 'react';
import '../styles/loginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
  
    const authenticationServiceUrl = process.env.REACT_APP_AUTHENTICATION_SERVICE_URL;
    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;
  
  
    const handleLogin = async (event) => {
      event.preventDefault();
    console.log(process.env.REACT_APP_AUTHENTICATION_SERVICE_URL);
      try {
        const res = await fetch(`${authenticationServiceUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });
    
        if (!res.ok) {
          throw new Error('Invalid username or password');
        }
    
        const data = await res.json();
    
        if (data.user) {
          let userWithExtraInfo = { ...data.user };
    
          if (data.user.userType === 2) {
            
            const verificationStatus = await getDriverVerificationStatus(data.user.id);
    
            userWithExtraInfo = {
              ...data.user,
              verificationStatus: verificationStatus
            };
          }
    
          sessionStorage.setItem('user', JSON.stringify(userWithExtraInfo));
          console.log(data);
          console.log(userWithExtraInfo);
          window.location.href = '/';
        } else {
          setLoginError(true);
        }
      } catch (error) {
        setLoginError(true);
        console.log(error);
      }
    };
    
  

    const getDriverVerificationStatus = async (userId) => {
      try {
        const response = await fetch(`${communicationServiceUrl}/getVerificationStatus/${userId}`);
    
        if (!response.ok) {
          throw new Error('Failed to get verification status');
        }
    
        const data = await response.text();
        return data;
      } catch (err) {
        setLoginError(err.message);
        return null; 
      }
    };
    

    return (
      <div className='login-div'>
        <h2 className='header-login'>Log in page</h2>
        <form className='form-login' onSubmit={handleLogin}>
          <label className='label-login'>
            Username:
            <input 
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <br />
          <label className='label-login'> 
            Password: 
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button className='button-login' type="submit">Sign in</button>
          {loginError && <p style={{ color: 'red' }}>Wrong username or password.</p>}
        </form>
      </div>
    );
  };
  
  export default LoginPage;