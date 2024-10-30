import React, { createContext, useContext, useState } from 'react';
import ExaClient from '../services/exaClient';
import toast from 'react-hot-toast';

const ExaContext = createContext();

export function ExaProvider({ children }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('exaApiKey') || '');
  const [client, setClient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const updateApiKey = (newApiKey) => {
    try {
      const newClient = new ExaClient(newApiKey);
      setClient(newClient);
      setApiKey(newApiKey);
      localStorage.setItem('exaApiKey', newApiKey);
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
