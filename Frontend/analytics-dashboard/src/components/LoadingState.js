import React from 'react';
import {
  Box,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
} from '@chakra-ui/react';

const LoadingState = () => {
  return (
    <Box>
      {/* KPI Cards Loading State */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {[...Array(4)].map((_, i) => (
          <Box
            key={`kpi-skeleton-${i}`}
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
          >
            <Skeleton height="20px" width="100px" mb={2} />
            <Skeleton height="30px" width="80px" mb={2} />
            <Skeleton height="16px" width="60px" />
          </Box>
        ))}
      </SimpleGrid>

      {/* Main Dashboard Content Loading State */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Left Panel - Campaign Performance */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="sm"
          height="500px"
        >
          <Skeleton height="30px" width="200px" mb={6} />
          <Stack spacing={4}>
            <Skeleton height="180px" />
            <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
            <SimpleGrid columns={2} spacing={4} mt={4}>
              <Skeleton height="100px" />
              <Skeleton height="100px" />
            </SimpleGrid>
          </Stack>
        </Box>

        {/* Right Panel - Marketing Insights */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="sm"
          height="500px"
        >
          <Skeleton height="30px" width="180px" mb={6} />
          <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" />
          <Skeleton height="250px" mt={6} />
          <SimpleGrid columns={2} spacing={4} mt={4}>
            <Skeleton height="60px" />
            <Skeleton height="60px" />
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default LoadingState;
