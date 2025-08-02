import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Sidebar />
      <Header />
      <Box ml="200px" pt="60px" p="4">
        <Dashboard />
      </Box>
    </ChakraProvider>
  );
}

export default App;
