import React, { useState, useEffect } from 'react';
import './../styles/createdRidesPage.css'; 

const CreatedRidesPage = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [isCountdownVisible, setIsCountdownVisible] = useState(false);
    const [isDriveCountdownVisible, setIsDriveCountdownVisible] = useState(false);
    const [user,setUser] = useState(null);
    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;

//    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(storedUser);
    }, []);


    useEffect(() => {
        if (!user) return;

        console.log(user);
        if(user && (user.userType !== 2 || user.verificationStatus !== "Approved"))
        {
            window.location.href = '/';
            return;
        }
        
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
                    console.log('novi set' + user);
                    sessionStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '/createdRides';
                }
        
            } catch(err) {
                setError(err.message);
            }
        };
        
        const fetchRides = async () => {
            if(!user) return;
            try {
                const response = await fetch(`${communicationServiceUrl}/getCreatedRides`);
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
    }, [user, communicationServiceUrl]);

 
    const handleAcceptClick = async (rideId, estimatedWait) => {
        try {
            const userId = user.id;

            const response = await fetch(`${communicationServiceUrl}/acceptRide/${rideId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userId),
            });
 
            if (!response.ok) {
                throw new Error('Failed to accept the ride');
            }
 
            const response2 = await fetch(`${communicationServiceUrl}/getEstimatedDrive/${rideId}`);
 
            if (!response2.ok) {
                throw new Error('Failed to get estimated drive');
            }
            const data = await response2.json();
            const estimatedDrive = data;
            
 
            // Hide rides and start the wait countdown
            setRides([]);
            setIsCountdownVisible(true);
            startCountdown(estimatedWait, () => {
                //fetch for ongoing
                updateRideStatusToOngoing(rideId);
                setIsCountdownVisible(false);
                setIsDriveCountdownVisible(true);
                // Start the drive countdown after the wait countdown finishes
                startCountdown(estimatedDrive, () => {
                    setIsDriveCountdownVisible(false);
                    //fetch for complete
                    updateRideStatusToCompleted(rideId);
                    // Refresh the page after the drive countdown ends
                    window.location.reload();
                });
            });
 
        } catch (err) {
            setError(err.message);
        }
    };
 
    const startCountdown = (duration, onComplete) => {
        setCountdown(duration);
        const intervalId = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalId);
                    onComplete();
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    const updateRideStatusToOngoing = async (rideId) => {
        try
        {
            const response = await fetch(`${communicationServiceUrl}/setRideOngoing/${rideId}`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                }

            });

            if(!response.ok) {
                throw new Error('Failed to update ride status to ongoing');
            }
        } catch(err) {
            setError(err.message);
        }
    };

    const updateRideStatusToCompleted= async (rideId) => {
        try
        {
            const response = await fetch(`${communicationServiceUrl}/setRideCompleted/${rideId}`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                }

            });

            if(!response.ok) {
                throw new Error('Failed to update ride status to completed');
            }
        } catch(err) {
            setError(err.message);
        }
    };
 
    if (loading) return <div className="created-rides-loading">Loading...</div>;
    if (error) return <div className="created-rides-error">Error: {error}</div>;

    if (isCountdownVisible) {
        return (
            <div className="created-rides-countdown">
                <h3>Passenger pick up in: {countdown} seconds</h3>
            </div>
        );
    }

    if (isDriveCountdownVisible) {
        return (
            <div className="created-rides-countdown">
                <h3>Arriving to the destination in: {countdown} seconds</h3>
            </div>
        );
    }

    return (
        <div className="created-rides-container">
            <h2 className="created-rides-header">Created Rides</h2>
            {rides.length > 0 ? (
                <ul className="created-rides-list">
                    {rides.map((ride) => (
                        <li key={ride.rideID}>
                            <p>Ride from {ride.startLocation} to {ride.endLocation}</p>
                            <p>Estimated passenger pick up in: {ride.estimatedWait}</p>
                            <button className="created-rides-button" onClick={() => handleAcceptClick(ride.rideID, ride.estimatedWait)}>Accept</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No rides available</p>
            )}
        </div>
    );
};
 
export default CreatedRidesPage;