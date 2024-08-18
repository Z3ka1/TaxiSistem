import React, { useState, useEffect } from 'react';
 
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
 
    const user = JSON.parse(sessionStorage.getItem("user"));
 
    useEffect(() => {
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
            const response = await fetch('http://localhost:8246/communication/createRide', {
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
            const response = await fetch(`http://localhost:8246/communication/rideStatus/${id}`);
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
            const response = await fetch(`http://localhost:8246/communication/getEstimatedDriveAndDriverId/${rideId}`);
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
            const response = await fetch(`http://localhost:8246/communication/rateDriver/${driverId}`, {
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
        return <div>Error: {error}</div>;
    }

    if (!isOrderClicked) {
        return (
        <div>
            <h2>Create a New Ride</h2>
            <input
                type="text"
                placeholder="Start Address"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
            />
            <input
                type="text"
                placeholder="End Address"
                value={endAddress}
                onChange={(e) => setEndAddress(e.target.value)}
            />
            <button onClick={handleOrderClick}>Order</button>
        </div>
        );
    }

    if (!isRideCreated) {
        return (
            <div>
                    <h2>Confirm Ride</h2>
                    <p>Start: {startAddress}</p>
                    <p>End: {endAddress}</p>
                    <p>Price: {price}</p>
                    <p>Estimated Wait: {waitTime} seconds</p>
                    <button onClick={handleConfirmClick}>Confirm</button>
                </div>
        );
    }

    if(!isRideAccepted) {
        return (
            <div>Ride created successfully! Waiting for driver to accept your ride...</div>
        );
    }

    if(!isRatingVisible && !isWaitingFinished) {
        return (
            <div>
                <h3>Driver arriving in: {countdown} seconds</h3>
            </div>
        );
    }

    if(!isRatingVisible && isWaitingFinished) {
        return (
            <div>
                <h3>Arriving to the destination in: {countdown} seconds</h3>
            </div>
        );
    }

    return (
        <div>
            <h2>Rate Your Driver</h2>
            <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <button onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
    );
 
    // return (
    //     <div>
    //         {!isOrderClicked ? (
    //             <div>
    //                 <h2>Create a New Ride</h2>
    //                 <input
    //                     type="text"
    //                     placeholder="Start Address"
    //                     value={startAddress}
    //                     onChange={(e) => setStartAddress(e.target.value)}
    //                 />
    //                 <input
    //                     type="text"
    //                     placeholder="End Address"
    //                     value={endAddress}
    //                     onChange={(e) => setEndAddress(e.target.value)}
    //                 />
    //                 <button onClick={handleOrderClick}>Order</button>
    //             </div>
    //         ) : !isRideCreated ? (
    //             <div>
    //                 <h2>Confirm Ride</h2>
    //                 <p>Start: {startAddress}</p>
    //                 <p>End: {endAddress}</p>
    //                 <p>Price: {price}</p>
    //                 <p>Estimated Wait: {waitTime} seconds</p>
    //                 <button onClick={handleConfirmClick}>Confirm</button>
    //             </div>
    //         ) : !isRideAccepted ? (
    //             <div>Ride created successfully! Waiting for driver to accept your ride...</div>
    //         ) : !isRatingVisible ? (
    //             <div>
    //                 <h3>Drive in progress: {countdown} seconds</h3>
    //             </div>
    //         ) : (
    //             <div>
    //                 <h2>Rate Your Driver</h2>
    //                 <input
    //                     type="number"
    //                     min="1"
    //                     max="5"
    //                     value={rating}
    //                     onChange={(e) => setRating(e.target.value)}
    //                 />
    //                 <button onClick={handleRatingSubmit}>Submit Rating</button>
    //             </div>
    //         )}
    //     </div>
    // );
};
 
export default NewRidePage;