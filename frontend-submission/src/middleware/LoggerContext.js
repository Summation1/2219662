import React, { createContext, useContext } from 'react';

const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const log = (message, data = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      ...data,
    };
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push(entry);
    localStorage.setItem('logs', JSON.stringify(logs));
  };

  return (
    <LoggerContext.Provider value={{ log }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => useContext(LoggerContext);
