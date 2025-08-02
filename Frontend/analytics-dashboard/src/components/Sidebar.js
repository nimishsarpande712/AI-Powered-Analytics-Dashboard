import React from 'react';
import { Box, VStack, Heading, Icon, Text, Flex, useBreakpointValue, useColorMode, IconButton } from '@chakra-ui/react';
import { FiHome, FiPieChart, FiDatabase, FiSettings } from 'react-icons/fi';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          zIndex="998"
          onClick={onClose}
        />
      )}
      
      <Box
        as="nav"
        w="200px"
        h="100vh"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        position="fixed"
        left={isMobile ? (isOpen ? "0" : "-200px") : "0"}
        top="0"
        boxShadow="sm"
        zIndex="999"
        transition="left 0.3s ease"
      >
        <Box p="6">
          <Heading size="md" color="brand.500">Dashboard</Heading>
        </Box>
        <VStack align="stretch" spacing="2" p="4">
          <NavItem 
            icon={FiHome} 
            isActive={activeTab === 'overview'}
            onClick={() => {
              onTabChange('overview');
              if (isMobile) onClose();
            }}
          >
            Overview
          </NavItem>
          <NavItem 
            icon={FiPieChart}
            isActive={activeTab === 'campaigns'}
            onClick={() => {
              onTabChange('campaigns');
              if (isMobile) onClose();
            }}
          >
            Campaigns
          </NavItem>
          <NavItem 
            icon={FiDatabase}
            isActive={activeTab === 'data'}
            onClick={() => {
              onTabChange('data');
              if (isMobile) onClose();
            }}
          >
            Data
          </NavItem>
          <NavItem 
            icon={FiSettings}
            isActive={activeTab === 'settings'}
            onClick={() => {
              onTabChange('settings');
              if (isMobile) onClose();
            }}
          >
            Settings
          </NavItem>
          
          <Box mt={4} borderTop="1px" borderColor="gray.200" pt={4}>
            <Flex align="center" justify="space-between">
              <Text fontSize="sm">Toggle Theme</Text>
              <IconButton
                aria-label="Toggle Color Mode"
                icon={colorMode === 'dark' ? <SunIcon color="yellow.300" /> : <MoonIcon color="blue.700" />}
                onClick={toggleColorMode}
                variant="ghost"
                colorScheme={colorMode === 'dark' ? 'yellow' : 'blue'}
                size="sm"
              />
            </Flex>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

// NavItem component for sidebar navigation items
const NavItem = ({ icon, children, isActive = false, onClick }) => {
  return (
    <Box
      onClick={onClick}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      cursor="pointer"
    >
      <Flex
        align="center"
        p="3"
        mx="-2"
        borderRadius="md"
        role="group"
        fontWeight={isActive ? "semibold" : "normal"}
        bg={isActive ? "brand.50" : "transparent"}
        color={isActive ? "brand.500" : "gray.600"}
        _hover={{
          bg: 'brand.50',
          color: 'brand.500',
        }}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="16"
            as={icon}
            color={isActive ? "brand.500" : "gray.500"}
            _groupHover={{
              color: 'brand.500',
            }}
          />
        )}
        <Text>{children}</Text>
      </Flex>
    </Box>
  );
};

export default Sidebar;
