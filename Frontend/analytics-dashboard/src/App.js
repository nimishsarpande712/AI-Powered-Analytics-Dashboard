import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <>
      <Sidebar />
      <Header />
      <Box ml="200px" pt="60px" p="4">
        {/* Main content goes here */}
      </Box>
    </>
  );
}

export default App;
