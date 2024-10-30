import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const PAGES = {
  DASHBOARD: 'dashboard',
  PROJECTS: 'projects',
  TEMPLATES: 'templates',
  ANALYTICS: 'analytics',
  EDITOR: 'editor'
};

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState(PAGES.EDITOR);

  return (
    <NavigationContext.Provider value={{ 
      currentPage,
      setCurrentPage
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);
