import { useState } from 'react';
import '../styles/loginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
  
  
    const handleLogin = (event) => {
      event.preventDefault();
  
      fetch('http://localhost:8553/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })
        .then((res) =>{ 
          if(!res.ok) {
            throw new Error('Invalid username or password');
          }

          return res.json()
        })
        .then((data) => {
         
          if (data.user) {
            // Ako server vrati korisnika, sačuvaj podatke korisnika u lokalnom skladištu
            sessionStorage.setItem('user', JSON.stringify(data.user));
            console.log(data)
            window.location.href = '/';
          } else {
            setLoginError(true);
          }
        })
        .catch((error) => {
          setLoginError(true);
          console.log(error);
        });
    };
  
    return (
      <div className='login-div'>
        <h2 className='header-login'>Prijava korisnika</h2>
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
            Lozinka: 
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button className='button-login' type="submit">Prijavi se</button>
          {loginError && <p style={{ color: 'red' }}>Pogrešno korisničko ime ili lozinka.</p>}
        </form>
      </div>
    );
  };
  
  export default LoginPage;