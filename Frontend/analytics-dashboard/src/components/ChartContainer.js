import React from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ChartContainer = ({ children, title, height = '400px', ...props }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      p={6}
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      borderRadius="lg"
      boxShadow="md"
      height={height}
      width="100%"
      position="relative"
      {...props}
    >
      {title && (
        <Box
          mb={4}
          fontSize="lg"
          fontWeight="bold"
          color={colorMode === 'dark' ? 'white' : 'gray.700'}
        >
          {title}
        </Box>
      )}
      <Box
        position="relative"
        height="calc(100% - 40px)"
        width="100%"
      >
        {children}
      </Box>
    </Box>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  height: PropTypes.string,
};

export default ChartContainer;
