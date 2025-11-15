import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'alert' | 'sos' | 'info';
}

interface EmergencyContextType {
  contacts: Contact[];
  notifications: Notification[];
  addContact: (name: string, phone: string) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  sendSOS: () => Promise<void>;
  addNotification: (message: string, type: 'alert' | 'sos' | 'info') => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Dr. Smith', phone: '+1 (555) 123-4567' },
    { id: '2', name: 'Emergency Services', phone: '911' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Welcome to Health Monitor',
      timestamp: new Date(),
      type: 'info',
    },
  ]);

  const addContact = async (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
    };
    setContacts((prev) => [...prev, newContact]);
    addNotification(`New contact added: ${name}`, 'info');
  };

  const removeContact = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    addNotification('Contact removed', 'info');
  };

  const sendSOS = async () => {
    addNotification('SOS Alert sent to all emergency contacts!', 'sos');
  };

  const addNotification = (message: string, type: 'alert' | 'sos' | 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <EmergencyContext.Provider
      value={{
        contacts,
        notifications,
        addContact,
        removeContact,
        sendSOS,
        addNotification,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
