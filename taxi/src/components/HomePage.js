import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import './../styles/homePage.css';


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
  

  
  if (!user) {
    return (
        <div className="home-container">
            <div className="welcome-message">
                <h1>Welcome to TaxiApp!</h1>
                <p>Please register or log in to access the system.</p>
                <a href="/register" className="button">Register</a>
                <a href="/login" className="button">Login</a>
            </div>
        </div>
    );
  } 

return (
    <div className="home-container">
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            
            {user.userType === 0 && (
                <>
                    {/* Admin Sections */}
                    <div className="section admin-profile">
                        <h2 className="section-title">Profile</h2>
                        <p className="section-description">View and manage your profile information.</p>
                        <a href="/profile" className="section-link">Go to Profile</a>
                    </div>
                    <div className="section admin-verification">
                        <h2 className="section-title">Verification</h2>
                        <p className="section-description">Verify driver credentials.</p>
                        <a href="/verification" className="section-link">Go to Verification</a>
                    </div>
                    <div className="section admin-all-rides">
                        <h2 className="section-title">All Rides</h2>
                        <p className="section-description">View all rides in the system.</p>
                        <a href="/allRides" className="section-link">View All Rides</a>
                    </div>
                    <div className="section admin-driver-ratings">
                        <h2 className="section-title">Drivers</h2>
                        <p className="section-description">Manage drivers based on their ratings.</p>
                        <a href="/profile" className="section-link">Go to Driver Ratings</a>
                    </div>
                </>
            )}
            
            {user.userType === 1 && (
                <>
                    {/* User Sections */}
                    <div className="section user-profile">
                        <h2 className="section-title">Profile</h2>
                        <p className="section-description">View and manage your profile information.</p>
                        <a href="/profile" className="section-link">Go to Profile</a>
                    </div>
                    <div className="section user-new-ride">
                        <h2 className="section-title">New Ride</h2>
                        <p className="section-description">Create a new ride request.</p>
                        <a href="/newRide" className="section-link">Create New Ride</a>
                    </div>
                    <div className="section user-previous-rides">
                        <h2 className="section-title">Previous Rides</h2>
                        <p className="section-description">View your previous ride history.</p>
                        <a href="/previousRides" className="section-link">View Previous Rides</a>
                    </div>
                </>
            )}

            {user.userType === 2 && user.verificationStatus === 'Approved' && (
                <>
                    {/* Driver Sections */}
                    <div className="section driver-profile">
                        <h2 className="section-title">Profile</h2>
                        <p className="section-description">View and manage your profile information.</p>
                        <a href="/profile" className="section-link">Go to Profile</a>
                    </div>
                    <div className="section driver-new-drive">
                        <h2 className="section-title">New Drive</h2>
                        <p className="section-description">Create a new drive request.</p>
                        <a href="/createdRides" className="section-link">Create New Drive</a>
                    </div>
                    <div className="section driver-my-drives">
                        <h2 className="section-title">My Drives</h2>
                        <p className="section-description">View your current and past drives.</p>
                        <a href="/myDrives" className="section-link">View My Drives</a>
                    </div>
                </>
            )}

              {user.userType === 2 && user.verificationStatus !== 'Approved' && (
                <>
                    {/* Driver Sections */}
                    <div className="section driver-profile">
                        <h2 className="section-title">Profile</h2>
                        <p className="section-description">View and manage your profile information.</p>
                        <a href="/profile" className="section-link">Go to Profile</a>
                    </div>
                </>
               )}
        </div>
    </div>
  );

};
  
export default HomePage;