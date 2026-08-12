import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';

interface LowDataContextType {
  lowDataMode: boolean;
  toggleLowDataMode: () => void;
}

const LowDataContext = createContext<LowDataContextType | undefined>(undefined);

export const LowDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lowDataMode, setLowDataModeState] = useState<boolean>(false);

  useEffect(() => {
    setLowDataModeState(storageService.getLowDataMode());
  }, []);

  const toggleLowDataMode = () => {
    const updated = !lowDataMode;
    setLowDataModeState(updated);
    storageService.setLowDataMode(updated);
  };

  return (
    <LowDataContext.Provider value={{ lowDataMode, toggleLowDataMode }}>
      {children}
    </LowDataContext.Provider>
  );
};

export const useLowData = () => {
  const context = useContext(LowDataContext);
  if (!context) {
    throw new Error('useLowData must be used within a LowDataProvider');
  }
  return context;
};
