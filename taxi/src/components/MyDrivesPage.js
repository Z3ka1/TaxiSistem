import React, { useState, useEffect } from 'react';
import './../styles/previousRidesPage.css';

const MyDrivesPage = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user,setUser] = useState(null);

    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;

    //const user = JSON.parse(sessionStorage.getItem("user"));
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    useEffect(() => {
        if(!user) return;

        if(user && (user.userType !== 2 || user.verificationStatus !== 'Approved')){
            window.location.href = '/';
            return;
        }

        
        const fetchRides = async () => {
            if(!user) return;
            try {
                const response = await fetch(`${communicationServiceUrl}/getPreviousDrives/${user.id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setRides(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDriverVerificationStatus(user.id);
        fetchRides();
    }, [user,communicationServiceUrl]);

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
                window.location.href = '/myDrives';
            }
    
        } catch(err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="previous-rides-page">
            <h2>My previous drives</h2>
            {rides.length > 0 ? (
                <ul>
                    {rides.map((ride) => (
                        <li key={ride.rideID}>
                            <p className="ride-info">Ride from {ride.startLocation} to {ride.endLocation}</p>
                            <p className="ride-price">Income: {ride.estimatedPrice}</p>
                            <p className="ride-duration">Duration: {ride.estimatedWait + ride.estimatedDrive} seconds</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No previous drives available</p>
            )}
        </div>
    );
};

export default MyDrivesPage;
