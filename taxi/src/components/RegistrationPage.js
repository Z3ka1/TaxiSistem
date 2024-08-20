import { useState } from 'react';
import '../styles/registrationPage.css'

const RegistrationPage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    userType: '',
    avatar: ''
    });


  const authenticationServiceUrl = process.env.REACT_APP_AUTHENTICATION_SERVICE_URL;
  const [message, setMessage] = useState('');
  //const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try{
      const response = await fetch(`${authenticationServiceUrl}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json'},
          body: JSON.stringify(userData)
        }
      );
      
      if(response.ok) {
        setMessage('Registration successful!');
        setUserData({
          firstName: '',
          lastName: '',
          address: '',
          dateOfBirth: '',
          username: '',
          email: '',
          password: '',
          password2: '',
          userType: '',
          avatar: ''

        });
      } else {
        const errorData = await response.json();
        setMessage("Error: " + errorData.message);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }

  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

//   const handleChange = (event) => {
//     const { name, value, files } = event.target;

//     if (name === "avatar") {
//         const file = files[0];
//         setUserData({ ...userData, avatar: file });
//     } else {
//         setUserData({ ...userData, [name]: value });
//     }
// };



  return (
    <div className='add-div'>
      <h2 className='add-header'>New user registration</h2>
     
      <form className='add-form' onSubmit={handleSubmit}>
        <input className='add-input' type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="First name" required />
        <input className='add-input' type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Last name" required />
        <input className='add-input' type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Address" required />
        <input className='add-input' type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleChange} placeholder="Date" required/>
        <input className='add-input' type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" required/>
        <input className='add-input' type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required/>
        <input className='add-input' type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" required />
        <input className='add-input' type="password" name="password2" value={userData.password2} onChange={handleChange} placeholder="Repeat Password" required />

        <select className='add-input' name="userType" value={userData.userType} onChange={handleChange} required>
            <option value="">Choose user type</option>
            <option value="User">User</option>
            <option value="Driver">Driver</option>
        </select>
        <input className='add-input' type="file" name="avatar" onChange={handleChange} accept="image/*"  />


        <button className='add-button' type="submit">Register</button>
      </form>
     <p>{message}</p>
    </div>
  );
};

export default RegistrationPage;