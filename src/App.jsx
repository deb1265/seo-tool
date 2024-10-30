import React from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import EditorPanel from './components/editor/EditorPanel';
import Dashboard from './components/pages/Dashboard';
import Projects from './components/pages/Projects';
import Templates from './components/pages/Templates';
import Analytics from './components/pages/Analytics';
import { ApiProvider } from './context/ApiContext';
import { ChatProvider } from './context/ChatContext';
import { ExaProvider } from './context/ExaContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { NavigationProvider, useNavigation, PAGES } from './context/NavigationContext';

const StyledApp = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background};
`

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: ${props => props.theme.spacing.lg};
  gap: ${props => props.theme.spacing.lg};
`

function MainView() {
  const { currentPage } = useNavigation();

  switch (currentPage) {
    case PAGES.DASHBOARD:
      return <Dashboard />;
    case PAGES.PROJECTS:
      return <Projects />;
    case PAGES.TEMPLATES:
      return <Templates />;
    case PAGES.ANALYTICS:
      return <Analytics />;
    default:
      return (
        <ContentArea>
          <EditorPanel />
          <ChatArea />
        </ContentArea>
      );
  }
}

function App() {
  return (
    <DatabaseProvider>
      <ApiProvider>
        <ChatProvider>
          <ExaProvider>
            <NavigationProvider>
              <StyledApp>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#333',
                      color: '#fff',
                      padding: '16px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                />
                <Header />
                <MainContent>
                  <Sidebar />
                  <MainView />
                </MainContent>
              </StyledApp>
            </NavigationProvider>
          </ExaProvider>
        </ChatProvider>
      </ApiProvider>
    </DatabaseProvider>
  );
}

export default App;
