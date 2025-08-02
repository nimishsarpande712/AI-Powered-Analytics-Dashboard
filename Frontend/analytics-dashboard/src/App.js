import React, { useState } from 'react';
import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns.fixed';
import Data from './pages/Data';
import Settings from './pages/Settings';
import theme from './theme';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add ColorModeScript to persist color mode
  React.useEffect(() => {
    // Add ColorModeScript to the document
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          var mode = localStorage.getItem('chakra-ui-color-mode');
          if (!mode) {
            localStorage.setItem('chakra-ui-color-mode', 'light');
          }
        } catch (err) {}
      })();
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'campaigns':
        return <Campaigns />;
      case 'data':
        return <Data />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <Header 
          onToggleSidebar={toggleSidebar} 
          activeTab={activeTab}
        />
        <Box 
          ml={{ base: "0", md: "200px" }} 
          pt="60px" 
          p="4"
          minH="100vh"
          bg="var(--chakra-colors-gray-50)"
          _dark={{ bg: "var(--chakra-colors-gray-800)" }}
          transition="all 0.2s"
        >
          {renderActiveComponent()}
        </Box>
      </ChakraProvider>
    </>
  );
}

export default App;
