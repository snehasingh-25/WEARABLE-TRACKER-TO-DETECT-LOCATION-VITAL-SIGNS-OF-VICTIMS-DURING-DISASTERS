import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VitalSigns {
  heartRate: number;
  temperature: number;
  status: 'Safe' | 'Risk';
  lastUpdated: Date;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface VitalsContextType {
  vitals: VitalSigns;
  location: LocationData;
  history: VitalSigns[];
}

const VitalsContext = createContext<VitalsContextType | undefined>(undefined);

export const VitalsProvider = ({ children }: { children: ReactNode }) => {
  const [vitals, setVitals] = useState<VitalSigns>({
    heartRate: 75,
    temperature: 36.5,
    status: 'Safe',
    lastUpdated: new Date(),
  });

  const [location] = useState<LocationData>({
    latitude: 37.7749,
    longitude: -122.4194,
  });

  const [history, setHistory] = useState<VitalSigns[]>([]);

  useEffect(() => {
    // Simulate real-time vital signs updates
    const interval = setInterval(() => {
      setVitals((prev) => {
        const newHeartRate = Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 5));
        const newTemperature = Math.max(36.0, Math.min(37.5, prev.temperature + (Math.random() - 0.5) * 0.2));
        
        // Determine status based on vitals
        const isAtRisk = newHeartRate > 95 || newHeartRate < 65 || newTemperature > 37.2 || newTemperature < 36.2;
        
        const newVitals = {
          heartRate: Math.round(newHeartRate * 10) / 10,
          temperature: Math.round(newTemperature * 10) / 10,
          status: isAtRisk ? 'Risk' as const : 'Safe' as const,
          lastUpdated: new Date(),
        };

        // Add to history (keep last 50 entries)
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory, newVitals];
          return newHistory.slice(-50);
        });

        return newVitals;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <VitalsContext.Provider value={{ vitals, location, history }}>
      {children}
    </VitalsContext.Provider>
  );
};

export const useVitals = () => {
  const context = useContext(VitalsContext);
  if (context === undefined) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
};
