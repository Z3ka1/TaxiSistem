import React, { useState, useEffect } from 'react';
 
const CreatedRidesPage = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [isCountdownVisible, setIsCountdownVisible] = useState(false);
    const [isDriveCountdownVisible, setIsDriveCountdownVisible] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));
 
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await fetch('http://localhost:8246/communication/getCreatedRides');
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
 
        fetchRides();
    }, []);
 
    const handleAcceptClick = async (rideId, estimatedWait) => {
        try {
            const userId = user.id;

            const response = await fetch(`http://localhost:8246/communication/acceptRide/${rideId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userId),
            });
 
            if (!response.ok) {
                throw new Error('Failed to accept the ride');
            }
 
            const response2 = await fetch(`http://localhost:8246/communication/getEstimatedDrive/${rideId}`);
 
            if (!response2.ok) {
                throw new Error('Failed to get estimated drive');
            }
            const data = await response2.json();
            const estimatedDrive = data;
            
 
            // Hide rides and start the wait countdown
            setRides([]);
            setIsCountdownVisible(true);
            startCountdown(estimatedWait, () => {
                //fetch za ongoing
                updateRideStatusToOngoing(rideId);
                setIsCountdownVisible(false);
                setIsDriveCountdownVisible(true);
                // Start the drive countdown after the wait countdown finishes
                startCountdown(estimatedDrive, () => {
                    setIsDriveCountdownVisible(false);
                    //fetch za complete
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
            const response = await fetch(`http://localhost:8246/communication/setRideOngoing/${rideId}`,{
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
            const response = await fetch(`http://localhost:8246/communication/setRideCompleted/${rideId}`,{
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
 
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
 
    if (isCountdownVisible) {
        return (
            <div>
                <h3>Passenger pick up in: {countdown} seconds</h3>
            </div>
        );
    }
 
    if (isDriveCountdownVisible) {
        return (
            <div>
                <h3>Arriving to the destination in: {countdown} seconds</h3>
            </div>
        );
    }
 
    return (
        <div>
            <h2>Created Rides</h2>
            {rides.length > 0 ? (
                <ul>
                    {rides.map((ride) => (
                        <li key={ride.rideID}>
                            <p>Ride from {ride.startLocation} to {ride.endLocation}</p>
                            <p>Estimated wait: {ride.estimatedWait}</p>
                            <button onClick={() => handleAcceptClick(ride.rideID, ride.estimatedWait)}>Accept</button>
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