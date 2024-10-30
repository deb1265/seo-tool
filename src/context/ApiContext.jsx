import React, { createContext, useContext, useState, useEffect } from 'react';
import OpenAI from 'openai';
import toast from 'react-hot-toast';
import { useDatabase } from './DatabaseContext';

const ApiContext = createContext();

const DEFAULT_MODELS = ['gpt-3.5-turbo', 'gpt-4'];

export function ApiProvider({ children }) {
  const [apiKey, setApiKey] = useState('');
  const [baseURL, setBaseURL] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('');
  const [customModels, setCustomModels] = useState(DEFAULT_MODELS);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const db = useDatabase();

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsLoading(true);
        
        // Load custom models
        const savedModels = await db.getCustomModels();
        setCustomModels(savedModels);

        // Load API settings
        const settings = await db.getApiSettings();
        if (settings?.length > 0) {
          const latest = settings[settings.length - 1];
          setApiKey(latest.apiKey);
          setBaseURL(latest.baseURL);
          setModel(latest.model);

          // Initialize OpenAI client
          const newClient = new OpenAI({
            apiKey: latest.apiKey,
            baseURL: latest.baseURL,
            dangerouslyAllowBrowser: true
          });
          setClient(newClient);
        }
      } catch (error) {
        console.error('Failed to initialize settings:', error);
        // Don't show error toast here as it might be first load
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, [db]);

  const addCustomModel = async (modelName) => {
    try {
      if (customModels.includes(modelName)) {
        toast.error('Model already exists');
        return;
      }
      
      const newModels = [...customModels, modelName];
      await db.saveCustomModels(newModels);
      setCustomModels(newModels);
      toast.success('Model added successfully');
    } catch (error) {
      console.error('Failed to add custom model:', error);
      toast.error('Failed to add model');
    }
  };

  const removeCustomModel = async (modelName) => {
    try {
      if (DEFAULT_MODELS.includes(modelName)) {
        toast.error('Cannot remove default models');
        return;
      }

      const newModels = customModels.filter(m => m !== modelName);
      await db.saveCustomModels(newModels);
      setCustomModels(newModels);
      
      if (model === modelName) {
        setModel('');
      }
      
      toast.success('Model removed successfully');
    } catch (error) {
      console.error('Failed to remove custom model:', error);
      toast.error('Failed to remove model');
    }
  };

  const updateConfig = async (newApiKey, newBaseURL, newModel) => {
    try {
      if (!newApiKey.trim()) {
        throw new Error('API Key is required');
      }

      if (!newModel.trim()) {
        throw new Error('Please select a model');
      }

      const loadingToast = toast.loading('Verifying API settings...');

      const newClient = new OpenAI({
        apiKey: newApiKey,
        baseURL: newBaseURL,
        dangerouslyAllowBrowser: true
      });

      try {
        await newClient.models.list();
      } catch (error) {
        toast.dismiss(loadingToast);
        if (error.status === 401) {
          throw new Error('Invalid API key. Please check your credentials.');
        }
        throw new Error('Failed to connect to API. Please try again.');
      }

      await db.saveApiSettings({
        apiKey: newApiKey,
        baseURL: newBaseURL,
        model: newModel
      });

      setApiKey(newApiKey);
      setBaseURL(newBaseURL);
      setModel(newModel);
      setClient(newClient);

      toast.dismiss(loadingToast);
      toast.success('API settings saved successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to save API settings');
      return false;
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px' 
      }}>
        Loading API settings...
      </div>
    );
  }

  return (
    <ApiContext.Provider value={{ 
      apiKey, 
      baseURL, 
      model, 
      client,
      customModels,
      addCustomModel,
      removeCustomModel,
      updateConfig 
    }}>
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext);
