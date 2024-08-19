import React, { useState, useEffect } from 'react';
 import './../styles/newRidePage.css';

const NewRidePage = () => {
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [price, setPrice] = useState(null);
    const [waitTime, setWaitTime] = useState(null);
    const [error, setError] = useState('');
    const [rideId, setRideId] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [isRideCreated, setIsRideCreated] = useState(false);
    const [isRideAccepted, setIsRideAccepted] = useState(false);
    const [isOrderClicked, setIsOrderClicked] = useState(false);
    const [isRatingVisible, setIsRatingVisible] = useState(false);
    const [rating, setRating] = useState(null);
    const [driverId, setDriverId] = useState(null);
    const [isWaitingFinished, setIsWaitingFinished] = useState(false);

    const communicationServiceUrl = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;
 
    const user = JSON.parse(sessionStorage.getItem("user"));
 
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if(!storedUser || storedUser.userType !== 1) {
            window.location.href = '/';
            return;
        }

        if (user) {
            console.log('Logged in as: ' + user.username);
        }
    }, []);
 
    const handleOrderClick = () => {
        const randomPrice = (Math.random() * (2000 - 300) + 300).toFixed(2);
        const randomWait = Math.floor(Math.random() * (60 - 6 + 1)) + 6;
 
        setPrice(randomPrice);
        setWaitTime(randomWait);
        setIsOrderClicked(true);
    };
 
    const handleConfirmClick = async () => {
        const rideDetails = {
            userId: user.id,
            startAddress,
            endAddress,
            price,
            waitTime
        };
 
        try {
            const response = await fetch(`${communicationServiceUrl}/createRide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rideDetails),
            });
 
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
 
            const data = await response.json();
            setIsRideCreated(true);
            setRideId(data.rideId);
            pollForRideAcceptance(data.rideId);
        } catch (err) {
            setError(err.message);
        }
    };
 
    const pollForRideAcceptance = async (id) => {
        const intervalId = setInterval(async () => {
            const response = await fetch(`${communicationServiceUrl}/rideStatus/${id}`);
            const status = await response.text();
            if (status === "Accepted") {
                clearInterval(intervalId);
                setIsRideAccepted(true);
                startCountdown(waitTime, () => {
                    setIsWaitingFinished(true);
                    fetchDriveTime(id);
                });
            }
        }, 1000);
    };
 
    const fetchDriveTime = async (rideId) => {
        try {
            const response = await fetch(`${communicationServiceUrl}/getEstimatedDriveAndDriverId/${rideId}`);
            const data = await response.json();
            setDriverId(data.driverId);

            console.log('Time: ' + data.time);
            console.log('Driver ID: ' + data.driverId)
            
            startCountdown(data.time, () => {
                setIsRatingVisible(true);
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
 
    const handleRatingSubmit = async () => {
        try {
            const response = await fetch(`${communicationServiceUrl}/rateDriver/${driverId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rating),
            });
 
            if (!response.ok) {
                throw new Error(`Error: ${response.message}`);
            }
 
            window.location.reload(); // Refresh the page after rating
        } catch (err) {
            setError(err.message);
        }
    };
 
    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!isOrderClicked) {
        return (
        <div className="container">
            <h2 className="heading">Create a New Ride</h2>
            <input
                type="text"
                className="input"
                placeholder="Start Address"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}/>
            <input
                type="text"
                className="input"
                placeholder="End Address"
                value={endAddress}
                onChange={(e) => setEndAddress(e.target.value)}/>
                <br/>
            <button className="button button-order" onClick={handleOrderClick}>Order</button>
        </div>
        );
    }

    if (!isRideCreated) {
        return (
            <div className="container">
                    <h2 className="subheading">Confirm Ride</h2>
                    <p className="details">Start: {startAddress}</p>
                    <p className="details">End: {endAddress}</p>
                    <p className="details">Price: {price}</p>
                    <p className="details">Estimated Wait: {waitTime} seconds</p>
                    <button className="button button-confirm" onClick={handleConfirmClick}>Confirm</button>
            </div>
        );
    }

    if(!isRideAccepted) {
        return (
            <div className="container">Ride created successfully! Waiting for driver to accept your ride...</div>
        );
    }

    if(!isRatingVisible && !isWaitingFinished) {
        return (
            <div className="container">
                <h3 className="countdown">Driver arriving in: {countdown} seconds</h3>
            </div>
        );
    }

    if(!isRatingVisible && isWaitingFinished) {
        return (
            <div className="container">
                <h3 className="countdown">Arriving to the destination in: {countdown} seconds</h3>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="subheading">Rate Your Driver</h2>
            <input
                type="number"
                min="1"
                max="5"
                className="rating-input"
                value={rating}
                onChange={(e) => setRating(e.target.value)}/>
                <br/>
            <button className="button button-rate" onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
    );
    
};
 
export default NewRidePage;