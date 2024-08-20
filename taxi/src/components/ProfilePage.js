import "../styles/profilePage.css"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [message, setMessage] = useState('');
  const [driverVerificationStatus, setDriverVerificationStatus] = useState("");
  const navigate = useNavigate();

  const profileServiceUrl = process.env.REACT_APP_PROFILE_SERVICE_URL;
  const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;
  const avatarUrl = process.env.REACT_APP_AVATAR_URL;

  //Ulogovani user 
  const [currentUser, setCurrentUser] = useState(null);
  //Podaci ulogovanog usera
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    

    //setuje u current user ulogovanog
    const storedUser = JSON.parse(sessionStorage.getItem('user'));

    if(storedUser.userType === 2)
      fetchDriverVerificationStatus(storedUser.id)

    if(storedUser)
    {
      setCurrentUser(storedUser);
      console.log('Logged in as : ' + storedUser.username);

      const url = `${profileServiceUrl}/${storedUser.id}`;
      console.log('Fetching data from URL: ', url)
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
    else
    {
      navigate('/login');    
    }
  }, [navigate, profileServiceUrl]);

  useEffect(() => {
    console.log('Updated userData: ', userData);
  }, [userData]);

  const fetchDriverVerificationStatus = async (driverId) => {
    try
    {
        const response = await fetch(`${communicationServiceUrl}/getVerificationStatus/${driverId}`);

        if(!response.ok) {
            throw new Error('Failed to update ride status to ongoing');
        }
        const data = await response.text();
        setDriverVerificationStatus(data);

    } catch(err) {
        setMessage(err.message);
    }
};

  const handleInputChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditUserData({});
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditUserData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
      avatar: userData.avatar
    });
  };

  const handleUpdateClick = () => {

    const data = {
      userID: currentUser.id,
      firstName: editUserData.firstName || userData.firstName,
      lastName: editUserData.lastName || userData.lastName,
      address: editUserData.address || userData.address,
      dateOfBirth: editUserData.dateOfBirth || userData.dateOfBirth,
      email: editUserData.email || userData.email,
      avatar: editUserData.avatar || userData.avatar
    };

    fetch(`${profileServiceUrl}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) =>{ 
        if(!res.ok) {
          throw new Error('Error, profile not updated');
        }

        return res.json()
      })
      .then((responseData) => {
        console.log("Response Data:", responseData);

        if (responseData.message === 'Profile updated!') {
          setMessage(responseData.message);
          console.log(responseData.user)
          setUserData(responseData.user)
          setEditMode(false);
        } else {
          setMessage(responseData.message);
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  };

  return (
    
    <div className='profile-update-container'>
      
      {!editMode && ( userData ? (
      <div className='user-details'>
        <h1 className='profile-update-heading'>Profile overview</h1>
        {currentUser.userType === 2 && <p><strong>Verification status:</strong> {driverVerificationStatus}</p>}
        <p><strong>First name:</strong> {userData.firstName}</p>
        <p><strong>Last name:</strong> {userData.lastName}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Date of birth:</strong> {userData.dateOfBirth}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        {userData.avatar != "" && (<> <p><strong>Avatar:</strong></p> <img src={avatarUrl+userData.avatar} height={100} width={100} alt="User Avatar"></img></>)} 
        <br/>
        {currentUser.userType === 1 && 
        <button onClick={handleEditClick} className="button-edit">Toggle edit</button>}
        {currentUser.userType === 2 && currentUser.verificationStatus === 'Approved' && 
        <button onClick={handleEditClick} className="button-edit">Toggle edit</button>}
        {message && <p style={{color:'green'}}>{message}</p>}
      </div> ) : (<p>Loading user data...</p>))
      }

      {editMode && userData && (
        
       <form className='update-form'>
        <table>
        <th colSpan={2}><h1 className='profile-update-heading'>Change profile data</h1></th>
          <tbody>
              <>
              <tr>
              <td><label>First name:</label></td>
              <td><input
                type='text'
                name='firstName'
                value={editUserData.firstName ?? userData.firstName ?? ''}
                onChange={handleInputChange}
              /></td>
            </tr>
            <tr>
              <td><label>Last name:</label></td>
              <td><input
                type='text'
                name='lastName'
                value={editUserData.lastName ?? userData.lastName ?? ''}
                onChange={handleInputChange}
              /></td>
            </tr>
            </>
            
            <tr>
              <td><label>Address:</label></td>
              <td><input
                type='text'
                name='address'
                value={editUserData.address ?? userData.address ?? ''}
                onChange={handleInputChange}
              /></td>
            </tr>
            <tr>
              <td><label>Date of birth:</label></td>
              <td><input
                type='date'
                name='dateOfBirth'
                // value={editUserData.dateOfBirth ?? userData.dateOfBirth ?? ''}
                onChange={handleInputChange}
              /></td>
            </tr>
            <tr>
              <td><label>Email:</label></td>
              <td><input
                type='text'
                name='email'
                value={editUserData.email ?? userData.email ?? ''}
                onChange={handleInputChange}
              /></td>
            </tr>
            <tr>
              <td><label>Avatar:</label></td>
              <td><input
                type='file'
                name='avatar'
                // value={editUserData.avatar ?? userData.Avatar ?? ''}
                onChange={handleInputChange}
              /></td>
            </tr>
            

          </tbody>
        </table>
  <div className='button-group'>
    <button type='button' className="cancel-button" onClick={handleCancelClick}>Cancel edit</button>
    <button type='button' onClick={handleUpdateClick}>EDIT</button>
  </div>
</form>

      )}

      
    </div>
  );
};

export default ProfilePage;