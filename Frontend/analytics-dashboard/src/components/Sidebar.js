import React from 'react';
import { Box, VStack, Heading, Link } from '@chakra-ui/react';

const Sidebar = () => {
  return (
    <Box
      as="nav"
      w="200px"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      left="0"
      top="0"
    >
      <Box p="6">
        <Heading size="md" color="brand.500">Dashboard</Heading>
      </Box>
      <VStack align="stretch" spacing="4" p="4">
        <Link href="#">Overview</Link>
        <Link href="#">Campaigns</Link>
        <Link href="#">Data</Link>
        <Link href="#">Settings</Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
