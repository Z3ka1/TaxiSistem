import React, { useState, useEffect } from 'react';
import './../styles/previousRidesPage.css';

const AllRidesPage = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(sessionStorage.getItem("user"));

    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if(!storedUser || storedUser.userType !== 0) {
            window.location.href = '/';
            return;
        }

        const fetchRides = async () => {
            try {
                const response = await fetch(`${communicationServiceUrl}/getAllRides`);
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
    }, [user, communicationServiceUrl]);

    const statusMap = {
        0: 'Created',
        1: 'Accepted',
        2: 'Ongoing',
        3: 'Completed',
    };



    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="previous-rides-page">
            <h2>All rides</h2>
            {rides.length > 0 ? (
                <ul>
                    {rides.map((ride) => (
                        <li key={ride.rideID}>
                            <p className="ride-info">Ride from {ride.startLocation} to {ride.endLocation}</p>
                            <p className="ride-price">Price: {ride.estimatedPrice}</p>
                            <p className="ride-duration">Total Duration: {ride.estimatedWait + ride.estimatedDrive} seconds</p>
                            <p className="ride-status">Status: {statusMap[ride.status] || 'Unknown'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No rides available</p>
            )}
        </div>
    );
};

export default AllRidesPage;
