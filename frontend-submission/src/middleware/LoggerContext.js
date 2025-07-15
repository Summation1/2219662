import React, { createContext, useContext } from 'react';
import { logEvent } from '../logging-middleware'; // ✅ Correct import

const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const log = async (message, data = {}) => {
    // Save locally in localStorage
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      ...data,
    };
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push(entry);
    localStorage.setItem('logs', JSON.stringify(logs));

    // Also send to remote logging middleware
    try {
      await logEvent(
        'frontend',                            // stack
        data.level || 'info',                 // level
        data.pkg || 'handler',               // package
        message                               // message
      );
    } catch (err) {
      console.error('Remote log failed:', err.message);
    }
  };

  return (
    <LoggerContext.Provider value={{ log }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => useContext(LoggerContext);
