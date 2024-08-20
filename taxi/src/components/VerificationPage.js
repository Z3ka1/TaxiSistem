import React, { useState, useEffect } from 'react';
 
import './../styles/verificationPage.css';
const VerificationPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const profileServiceUrl = process.env.REACT_APP_PROFILE_SERVICE_URL;
    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;
    const avatarUrl = process.env.REACT_APP_AVATAR_URL;

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if(!storedUser || storedUser.userType !== 0) {
            window.location.href = '/';
            return;
        }

        const fetchPendingDrivers = async () => {
            try {
                const response = await fetch(`${profileServiceUrl}/returnPendingDrivers`, {
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
    }, [profileServiceUrl]);
 
    const handleApprove = async (id) => {
        try {
            const response = await fetch(`${communicationServiceUrl}/approveDriver`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
            sendEmail(id);
            setDrivers(drivers.filter(driver => driver.id !== id));
        } catch (err) {
            console.error("Failed to approve driver:", err.message);
        }
    };

    const sendEmail = async (id) => {
        try
        {
        const response = await fetch(`${profileServiceUrl}/sendEmail`, {
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
        console.error("Failed to send email:", err.message);
    }

    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(`${communicationServiceUrl}/rejectDriver`, {
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
                                <td> {driver.avatar != "" && (
                                    <img src={avatarUrl+driver.avatar} alt="Avatar" className="verification-page-avatar" />)}
                                </td>
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