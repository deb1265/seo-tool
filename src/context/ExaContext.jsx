import React, { createContext, useContext, useState, useEffect } from 'react';
import ExaClient from '../services/exaClient';
import toast from 'react-hot-toast';
import { useDatabase } from './DatabaseContext';

const ExaContext = createContext();

export function ExaProvider({ children }) {
  const [apiKey, setApiKey] = useState('');
  const [client, setClient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const db = useDatabase();

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const settings = await db.getApiSettings();
        if (settings?.length > 0) {
          const latest = settings[settings.length - 1];
          setApiKey(latest.apiKey);
          setClient(new ExaClient(latest.apiKey));
        }
      } catch (error) {
        console.error('Failed to load Exa API key:', error);
      }
    };

    loadApiKey();
  }, [db]);

  const updateApiKey = async (newApiKey) => {
    try {
      if (!newApiKey.trim()) {
        throw new Error('API Key is required');
      }

      const newClient = new ExaClient(newApiKey);
      setClient(newClient);
      setApiKey(newApiKey);
      await db.saveApiSettings({ apiKey: newApiKey });
      toast.success('Exa API key updated successfully');
      return true;
    } catch (error) {
      toast.error('Invalid Exa API key');
      return false;
    }
  };

  const searchContent = async (query, options = {}) => {
    if (!client) {
      toast.error('Please configure Exa API key first');
      return null;
    }

    setIsSearching(true);
    try {
      const results = await client.searchAndContents(query, options);
      return results;
    } catch (error) {
      toast.error('Error searching content: ' + error.message);
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ExaContext.Provider value={{
      apiKey,
      client,
      isSearching,
      updateApiKey,
      searchContent
    }}>
      {children}
    </ExaContext.Provider>
  );
}

export const useExa = () => useContext(ExaContext);
