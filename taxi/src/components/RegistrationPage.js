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
    userType: '',
    avatar: ''
    });

  const [message, setMessage] = useState('');
  //const [successMessage, setSuccessMessage] = useState('');


//   const handleSubmit = (event) => {
//     event.preventDefault();
  
//     fetch('http://localhost:8000/registerUser', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     })
//     .then((res) => res.json())
//       .then((data) => {
//         setMessage(data.message)
//       })
//       .catch((error) => {
//         console.log(error);
//       });
   
//   };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className='add-div'>
      <h2 className='add-header'>Registracija novog korisnika</h2>
     
      <form className='add-form' >  {/* onSubmit={handleSubmit} */}
        <input className='add-input' type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="Ime" required />
        <input className='add-input' type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Prezime" required />
        <input className='add-input' type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Adresa" required />
        <input className='add-input' type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleChange} placeholder="Datum" required/>
        <input className='add-input' type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Korisnicko ime" required/>
        <input className='add-input' type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required/>
        <input className='add-input' type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Lozinka" required />

        <select className='add-input' name="userType" value={userData.userType} onChange={handleChange} required>
            <option value="">Izaberite tip korisnika</option>
            <option value="admin">Administrator</option>
            <option value="user">Korisnik</option>
            <option value="driver">Vozac</option>
        </select>
        <input className='add-input' type="file" name="avatar" value={userData.avatar} onChange={handleChange} accept="image/*"  />


        <button className='add-button' type="submit">Dodaj korisnika</button>
      </form>
     <p>{message}</p>
    </div>
  );
};

export default RegistrationPage;