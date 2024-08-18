import React, { useState, useEffect } from 'react';
import './../styles/previousRidesPage.css';

const MyDrivesPage = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await fetch(`http://localhost:8246/communication/getPreviousDrives/${user.id}`);
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
    }, [user.id]);

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
