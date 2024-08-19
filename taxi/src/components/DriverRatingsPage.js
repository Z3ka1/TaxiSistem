import React, { useState, useEffect } from 'react';
import './../styles/verificationPage.css';

const DriverRatingsPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if(!storedUser || storedUser.userType !== 0) {
            window.location.href = '/';
            return;
        }

        const fetchDrivers = async () => {
            try {
                const response = await fetch(`${communicationServiceUrl}/getAllDrivers`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data)
                setDrivers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
 
        fetchDrivers();
    }, [communicationServiceUrl]);
 
    const handleBlock = async (id) => {
        try {
            const response = await fetch(`${communicationServiceUrl}/blockDriver`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
        } catch (err) {
            console.error("Failed to block driver:", err.message);
        }
        window.location.href = '/driverRatings';
    };

    const handleUnblock = async (id) => {
        try {
            const response = await fetch(`${communicationServiceUrl}/unblockDriver`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
        } catch (err) {
            console.error("Failed to unblock driver:", err.message);
        }
        window.location.href = '/driverRatings';
    };
 

    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Blocked',
    };

    if (loading) {
        return <div className="verification-page-loading">Loading...</div>;
    }

    if (error) {
        return <div className="verification-page-error">Error: {error}</div>;
    }

    return (
        <div className="verification-page-container">
            <h1 className="verification-page-header">Driver ratings</h1>
            {drivers.length === 0 ? (
                <p>No drivers found.</p>
            ) : (
                <table className="verification-page-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Rating</th>
                            <th>Number of ratings</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.driverID}>
                                <td>{driver.driverID}</td>
                                <td>{statusMap[driver.status]}</td>
                                {driver.numberOfRatings > 0 ? (<td>{(driver.rating/driver.numberOfRatings).toFixed(2)}</td>) : (<td>No ratings</td>)}
                                <td>{driver.numberOfRatings}</td>
                                {driver.status !== 3 && <td><button className="verification-page-button verification-page-button-reject" onClick={() => handleBlock(driver.driverID)}>Block</button></td>}
                                {driver.status === 3 && <td><button className="verification-page-button verification-page-button-approve" onClick={() => handleUnblock(driver.driverID)}>Unblock</button></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
 
export default DriverRatingsPage;