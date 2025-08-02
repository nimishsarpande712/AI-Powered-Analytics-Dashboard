import React from 'react';
import { Flex, Box, Heading, IconButton, Avatar, useBreakpointValue, useColorMode } from '@chakra-ui/react';
import { HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';

const Header = ({ onToggleSidebar, activeTab }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const getPageTitle = () => {
    switch (activeTab) {
      case 'campaigns': return 'Campaign Management';
      case 'data': return 'Data Management';
      case 'settings': return 'Settings';
      default: return 'AI Analytics';
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      w="full"
      align="center"
      justify="space-between"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderBottom="1px solid"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      px="4"
      py="2"
      ml={{ base: "0", md: "200px" }}
      position="fixed"
      top="0"
      zIndex="1"
    >
      <IconButton
        aria-label="Toggle Menu"
        icon={<HamburgerIcon />}
        variant="ghost"
        onClick={onToggleSidebar}
        display={{ base: "flex", md: isMobile ? "flex" : "none" }}
      />
      <Heading size="md" color={colorMode === 'dark' ? 'white' : 'brand.500'}>{getPageTitle()}</Heading>
      <Flex align="center" gap="3">
        <IconButton
          aria-label="Toggle Color Mode"
          icon={colorMode === 'dark' ? <SunIcon color="yellow.300" /> : <MoonIcon color="blue.700" />}
          onClick={toggleColorMode}
          variant="solid"
          colorScheme={colorMode === 'dark' ? 'yellow' : 'blue'}
          size="md"
          borderRadius="md"
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: 'md'
          }}
          transition="all 0.2s"
        />
        <Avatar name="User Name" size="sm" />
      </Flex>
    </Flex>
  );
};

export default Header;
