import React from 'react';
import { Box, VStack, Heading, Link, Icon, Text, Flex } from '@chakra-ui/react';
import { FiHome, FiPieChart, FiDatabase, FiSettings } from 'react-icons/fi';

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
      boxShadow="sm"
    >
      <Box p="6">
        <Heading size="md" color="brand.500">Dashboard</Heading>
      </Box>
      <VStack align="stretch" spacing="2" p="4">
        <NavItem icon={FiHome} isActive={true}>
          Overview
        </NavItem>
        <NavItem icon={FiPieChart}>
          Campaigns
        </NavItem>
        <NavItem icon={FiDatabase}>
          Data
        </NavItem>
        <NavItem icon={FiSettings}>
          Settings
        </NavItem>
      </VStack>
    </Box>
  );
};

// NavItem component for sidebar navigation items
const NavItem = ({ icon, children, isActive = false }) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="3"
        mx="-2"
        borderRadius="md"
        role="group"
        cursor="pointer"
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
    </Link>
  );
};

export default Sidebar;
