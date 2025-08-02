import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { SearchIcon } from '@chakra-ui/icons';
import MetricCard from '../components/MetricCard';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const Data = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ID');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMarketingData();
  }, []);

  useEffect(() => {
    // Filter and sort data
    if (!Array.isArray(marketingData)) {
      setFilteredData([]);
      return;
    }
    
    let filtered = [...marketingData];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort data
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal; // Descending for numbers
      }
      return String(aVal).localeCompare(String(bVal));
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [marketingData, searchTerm, sortBy]);

  const fetchMarketingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getMarketingData();
      const data = response.data?.data || [];
      setMarketingData(data);
    } catch (err) {
      console.error('Error fetching marketing data:', err);
      setError('Failed to load marketing data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDataMetrics = () => {
    if (!marketingData.length) {
      return {
        totalRecords: 0,
        avgIncome: 0,
        totalSpent: 0,
        avgAge: 0
      };
    }

    const currentYear = new Date().getFullYear();
    const avgIncome = marketingData.reduce((sum, item) => sum + (item.Income || 0), 0) / marketingData.length;
    const totalSpent = marketingData.reduce((sum, item) => 
      sum + (item.MntWines || 0) + (item.MntFruits || 0) + (item.MntMeatProducts || 0) + 
      (item.MntFishProducts || 0) + (item.MntSweetProducts || 0) + (item.MntGoldProds || 0), 0
    );
    const avgAge = marketingData.reduce((sum, item) => 
      sum + (currentYear - (item.Year_Birth || currentYear)), 0
    ) / marketingData.length;

    return {
      totalRecords: marketingData.length,
      avgIncome,
      totalSpent,
      avgAge
    };
  };

  const metrics = calculateDataMetrics();

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
        <Button mt={4} colorScheme="blue" onClick={fetchMarketingData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>
        Data Management
      </Heading>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Data Metrics */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <MetricCard
              title="Total Records"
              value={metrics.totalRecords.toLocaleString()}
              percentageChange={0}
              delay={0}
            />
            <MetricCard
              title="Avg Customer Income"
              value={`$${metrics.avgIncome.toFixed(0)}`}
              percentageChange={5.2}
              delay={100}
            />
            <MetricCard
              title="Total Customer Spend"
              value={`$${metrics.totalSpent.toLocaleString()}`}
              percentageChange={12.8}
              delay={200}
            />
            <MetricCard
              title="Avg Customer Age"
              value={`${metrics.avgAge.toFixed(0)} years`}
              percentageChange={-1.2}
              delay={300}
            />
          </SimpleGrid>

          {/* Charts Section */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <Box p={4} bg="white" borderRadius="lg" boxShadow="base">
              <BarChart
                data={marketingData.slice(0, 10)}
                dataKey="Income"
                xAxisKey="ID"
                title="Customer Income Distribution"
              />
            </Box>
            <Box p={4} bg="white" borderRadius="lg" boxShadow="base">
              <PieChart
                data={[
                  { name: 'Wines', value: marketingData.reduce((sum, item) => sum + (item.MntWines || 0), 0) },
                  { name: 'Fruits', value: marketingData.reduce((sum, item) => sum + (item.MntFruits || 0), 0) },
                  { name: 'Meat', value: marketingData.reduce((sum, item) => sum + (item.MntMeatProducts || 0), 0) },
                  { name: 'Fish', value: marketingData.reduce((sum, item) => sum + (item.MntFishProducts || 0), 0) },
                  { name: 'Sweets', value: marketingData.reduce((sum, item) => sum + (item.MntSweetProducts || 0), 0) }
                ]}
                dataKey="value"
                nameKey="name"
                title="Product Category Distribution"
              />
            </Box>
          </SimpleGrid>

          {/* Data Controls */}
          <Box mb={6}>
            <HStack spacing={4} mb={4} justify="space-between" wrap="wrap">
              <Text fontSize="lg" fontWeight="semibold">
                Marketing Data ({filteredData.length} records)
              </Text>
              <HStack spacing={4}>
                <Button 
                  colorScheme="green" 
                  size="sm"
                  onClick={() => {
                    const csvContent = 'data:text/csv;charset=utf-8,' + 
                      // Header row
                      ['ID', 'Birth Year', 'Education', 'Marital Status', 'Income', 'Kids', 'Teens', 'Customer Since', 'Total Spent'].join(',') + '\n' +
                      // Data rows
                      filteredData.map(item => {
                        const totalSpent = (item.MntWines || 0) + (item.MntFruits || 0) + 
                          (item.MntMeatProducts || 0) + (item.MntFishProducts || 0) + 
                          (item.MntSweetProducts || 0) + (item.MntGoldProds || 0);
                        return [
                          item.ID,
                          item.Year_Birth,
                          item.Education,
                          item.Marital_Status,
                          item.Income,
                          item.Kidhome,
                          item.Teenhome,
                          item.Dt_Customer,
                          totalSpent
                        ].join(',');
                      }).join('\n');

                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'marketing_data.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Export Data
                </Button>
                <Button colorScheme="blue" size="sm">
                  Import Data
                </Button>
              </HStack>
            </HStack>

            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                maxW="200px"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="ID">Sort by ID</option>
                <option value="Income">Sort by Income</option>
                <option value="Year_Birth">Sort by Birth Year</option>
                <option value="Recency">Sort by Recency</option>
              </Select>
            </HStack>
          </Box>

          {/* Data Table */}
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="base"
            overflow="hidden"
          >
            {paginatedData.length > 0 ? (
              <>
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>ID</Th>
                      <Th>Birth Year</Th>
                      <Th>Education</Th>
                      <Th>Marital Status</Th>
                      <Th>Income</Th>
                      <Th>Kids</Th>
                      <Th>Teens</Th>
                      <Th>Customer Since</Th>
                      <Th>Total Spent</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((item, index) => {
                      const totalSpent = (item.MntWines || 0) + (item.MntFruits || 0) + 
                        (item.MntMeatProducts || 0) + (item.MntFishProducts || 0) + 
                        (item.MntSweetProducts || 0) + (item.MntGoldProds || 0);
                      
                      return (
                        <Tr key={item.ID || index}>
                          <Td fontWeight="medium">{item.ID}</Td>
                          <Td>{item.Year_Birth}</Td>
                          <Td>{item.Education}</Td>
                          <Td>{item.Marital_Status}</Td>
                          <Td>${(item.Income || 0).toLocaleString()}</Td>
                          <Td>{item.Kidhome || 0}</Td>
                          <Td>{item.Teenhome || 0}</Td>
                          <Td>{item.Dt_Customer}</Td>
                          <Td fontWeight="semibold">${totalSpent.toLocaleString()}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>

                {/* Pagination */}
                <Box p={4} borderTop="1px" borderColor="gray.200">
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.600">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </Text>
                    <HStack>
                      <Button
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <Text fontSize="sm">
                        Page {currentPage} of {totalPages}
                      </Text>
                      <Button
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </HStack>
                  </HStack>
                </Box>
              </>
            ) : (
              <Box p={8} textAlign="center">
                <Text color="gray.500" mb={4}>
                  No data found
                </Text>
                <Button colorScheme="blue">
                  Import Data
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Data;
