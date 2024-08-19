import React, { createContext, useContext, useState } from 'react';

// Create Context
const CountdownContext = createContext();

// Create Provider Component
export const CountdownProvider = ({ children }) => {
    const [isCountdownActive, setIsCountdownActive] = useState(false);

    return (
        <CountdownContext.Provider value={{ isCountdownActive, setIsCountdownActive }}>
            {children}
        </CountdownContext.Provider>
    );
};

// Custom Hook for using the context
export const useCountdown = () => useContext(CountdownContext);
