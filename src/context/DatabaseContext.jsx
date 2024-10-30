import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../db';
import toast from 'react-hot-toast';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        await db.init();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setError(error.message);
        toast.error('Failed to initialize database');
      }
    };

    initDB();
  }, []);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        padding: '20px',
        color: '#FF3B30',
        textAlign: 'center'
      }}>
        <h2>Database Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            background: '#2D5BFF',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px'
      }}>
        Initializing database...
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
