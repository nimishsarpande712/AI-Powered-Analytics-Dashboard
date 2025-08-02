import React from 'react';
import { Flex, Box, Heading, IconButton, Avatar } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Header = () => {
  return (
    <Flex
      as="header"
      w="full"
      align="center"
      justify="space-between"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px="4"
      py="2"
      ml="200px"
      position="fixed"
      top="0"
      zIndex="1"
    >
      <IconButton
        aria-label="Menu"
        icon={<HamburgerIcon />}
        variant="ghost"
      />
      <Heading size="md" color="brand.500">AI Analytics</Heading>
      <Box>
        <Avatar name="User Name" size="sm" />
      </Box>
    </Flex>
  );
};

export default Header;
