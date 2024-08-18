import React, { useState, useEffect } from 'react';
 
import './../styles/verificationPage.css';
const VerificationPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const fetchPendingDrivers = async () => {
            try {
                const response = await fetch("http://localhost:8511/profile/returnPendingDrivers", {
                    method: "POST",
                });
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
 
        fetchPendingDrivers();
    }, []);
 
    const handleApprove = async (id) => {
        try {
            const response = await fetch("http://localhost:8246/communication/approveDriver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
            setDrivers(drivers.filter(driver => driver.id !== id));
        } catch (err) {
            console.error("Failed to approve driver:", err.message);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch("http://localhost:8246/communication/rejectDriver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            console.log(id);
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
            setDrivers(drivers.filter(driver => driver.id !== id));
        } catch (err) {
            console.error("Failed to reject driver:", err.message);
        }
    };
 
    if (loading) {
        return <div className="verification-page-loading">Loading...</div>;
    }

    if (error) {
        return <div className="verification-page-error">Error: {error}</div>;
    }

    return (
        <div className="verification-page-container">
            <h1 className="verification-page-header">Pending Driver Approvals</h1>
            {drivers.length === 0 ? (
                <p>No pending drivers found.</p>
            ) : (
                <table className="verification-page-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Birth date</th>
                            <th>Email</th>
                            <th>Avatar</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id}>
                                <td>{driver.id}</td>
                                <td>{driver.firstName}</td>
                                <td>{driver.lastName}</td>
                                <td>{driver.address}</td>
                                <td>{driver.dateOfBirth}</td>
                                <td>{driver.email}</td>
                                <td><img src={driver.avatar} alt="Avatar" className="verification-page-avatar" /></td>
                                <td><button className="verification-page-button verification-page-button-approve" onClick={() => handleApprove(driver.id)}>Approve</button></td>
                                <td><button className="verification-page-button verification-page-button-reject" onClick={() => handleReject(driver.id)}>Reject</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
 
export default VerificationPage;