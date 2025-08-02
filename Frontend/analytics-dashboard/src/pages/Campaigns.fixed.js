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
  Badge,
  Button,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import DonutChart from '../components/charts/DonutChart';
import MetricCard from '../components/MetricCard';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const Campaigns = () => {
  const { colorMode } = useColorMode();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeChartTab, setActiveChartTab] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    // Filter and sort campaigns
    if (!Array.isArray(campaigns)) {
      setFilteredCampaigns([]);
      return;
    }
    
    let filtered = [...campaigns];

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

    setFilteredCampaigns(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [campaigns, searchTerm, sortBy]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.getCampaigns();
        if (response?.data?.data && response.data.data.length > 0) {
          setCampaigns(response.data.data);
        } else if (response?.data && response.data.length > 0) {
          setCampaigns(response.data);
        } else {
          // Mock data for demonstration purposes
          const mockCampaigns = [
            { id: 1, name: "Summer Sale", status: "active", conversionRate: 5.7, budget: 12000, impressions: 45000, clicks: 2800 },
            { id: 2, name: "Holiday Special", status: "paused", conversionRate: 3.2, budget: 8000, impressions: 32000, clicks: 1500 },
            { id: 3, name: "New Product Launch", status: "active", conversionRate: 7.1, budget: 15000, impressions: 60000, clicks: 3200 },
            { id: 4, name: "End of Season", status: "completed", conversionRate: 4.5, budget: 9000, impressions: 37500, clicks: 1850 },
            { id: 5, name: "Flash Sale", status: "active", conversionRate: 8.3, budget: 6000, impressions: 28000, clicks: 2100 },
            { id: 6, name: "Black Friday", status: "paused", conversionRate: 6.8, budget: 20000, impressions: 95000, clicks: 5600 },
            { id: 7, name: "Cyber Monday", status: "active", conversionRate: 9.2, budget: 18000, impressions: 88000, clicks: 7300 },
            { id: 8, name: "Back to School", status: "completed", conversionRate: 4.9, budget: 11000, impressions: 42000, clicks: 2200 },
            { id: 9, name: "Referral Program", status: "active", conversionRate: 7.5, budget: 5000, impressions: 22000, clicks: 1850 },
            { id: 10, name: "Email Campaign", status: "completed", conversionRate: 3.8, budget: 3000, impressions: 15000, clicks: 780 },
          ];
          setCampaigns(mockCampaigns);
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Fallback to mock data
        const mockCampaigns = [
          { id: 1, name: "Summer Sale", status: "active", conversionRate: 5.7, budget: 12000, impressions: 45000, clicks: 2800 },
          { id: 2, name: "Holiday Special", status: "paused", conversionRate: 3.2, budget: 8000, impressions: 32000, clicks: 1500 },
          { id: 3, name: "New Product Launch", status: "active", conversionRate: 7.1, budget: 15000, impressions: 60000, clicks: 3200 },
          { id: 4, name: "End of Season", status: "completed", conversionRate: 4.5, budget: 9000, impressions: 37500, clicks: 1850 },
          { id: 5, name: "Flash Sale", status: "active", conversionRate: 8.3, budget: 6000, impressions: 28000, clicks: 2100 },
        ];
        setCampaigns(mockCampaigns);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCampaignMetrics = () => {
    if (!campaigns.length) {
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        avgConversion: 0,
        totalSpend: 0
      };
    }
    
    // Calculate metrics directly
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const avgConversion = campaigns.reduce((sum, c) => sum + (parseFloat(c.conversionRate) || 0), 0) / totalCampaigns;
    const totalSpend = campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);

    return {
      totalCampaigns,
      activeCampaigns,
      avgConversion,
      totalSpend
    };
  };

  const metrics = calculateCampaignMetrics();

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
        <Button mt={4} colorScheme="blue" onClick={fetchCampaigns}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>
        Campaign Management
      </Heading>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Campaign Metrics */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <MetricCard
              title="Total Campaigns"
              value={metrics.totalCampaigns}
              percentageChange={12.5}
              delay={0}
            />
            <MetricCard
              title="Active Campaigns"
              value={metrics.activeCampaigns}
              percentageChange={8.3}
              delay={100}
            />
            <MetricCard
              title="Avg Conversion Rate"
              value={`${metrics.avgConversion.toFixed(1)}%`}
              percentageChange={-2.1}
              delay={200}
            />
            <MetricCard
              title="Total Spend"
              value={`$${metrics.totalSpend.toLocaleString()}`}
              percentageChange={15.7}
              delay={300}
            />
          </SimpleGrid>

          {/* Charts Section */}
          <Box mb={8}>
            <Tabs onChange={(index) => setActiveChartTab(index)} colorScheme="brand">
              <TabList>
                <Tab>Budget Analysis</Tab>
                <Tab>Status Distribution</Tab>
                <Tab>Performance Metrics</Tab>
              </TabList>

              <TabPanels>
                {/* Budget Analysis Tab */}
                <TabPanel p={0} pt={4}>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <Box p={4} borderRadius="lg" boxShadow="base" bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
                      <BarChart
                        data={campaigns.slice(0, 10)}
                        dataKey="budget"
                        xAxisKey="name"
                        title="Campaign Budget Distribution"
                      />
                    </Box>
                    <Box p={4} borderRadius="lg" boxShadow="base" bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
                      <PieChart
                        data={campaigns.slice(0, 5).map(c => ({
                          name: c.name,
                          value: c.budget
                        }))}
                        dataKey="value"
                        nameKey="name"
                        title="Top 5 Campaigns by Budget"
                      />
                    </Box>
                  </SimpleGrid>
                </TabPanel>

                {/* Status Distribution Tab */}
                <TabPanel p={0} pt={4}>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <Box p={4} borderRadius="lg" boxShadow="base" bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
                      <PieChart
                        data={[
                          { name: 'Active', value: campaigns.filter(c => c.status === 'active').length },
                          { name: 'Paused', value: campaigns.filter(c => c.status === 'paused').length },
                          { name: 'Completed', value: campaigns.filter(c => c.status === 'completed').length }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        title="Campaign Status Distribution"
                      />
                    </Box>
                    <Box p={4} borderRadius="lg" boxShadow="base" bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
                      <DonutChart
                        data={[
                          { name: 'Active', value: campaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.budget || 0), 0) },
                          { name: 'Paused', value: campaigns.filter(c => c.status === 'paused').reduce((sum, c) => sum + (c.budget || 0), 0) },
                          { name: 'Completed', value: campaigns.filter(c => c.status === 'completed').reduce((sum, c) => sum + (c.budget || 0), 0) }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        title="Budget Distribution by Status"
                      />
                    </Box>
                  </SimpleGrid>
                </TabPanel>

                {/* Performance Metrics Tab */}
                <TabPanel p={0} pt={4}>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <Box p={4} borderRadius="lg" boxShadow="base" bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
                      <BarChart
                        data={campaigns.slice(0, 10)}
                        dataKey="conversionRate"
                        xAxisKey="name"
                        title="Campaign Conversion Rates"
                      />
                    </Box>
                    <Box p={4} borderRadius="lg" boxShadow="base" bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
                      <BarChart
                        data={campaigns.slice(0, 10).map(c => ({
                          name: c.name,
                          clicks: c.clicks,
                          impressions: c.impressions / 100 // Scaled down for better visibility
                        }))}
                        dataKey="clicks"
                        xAxisKey="name"
                        title="Campaign Engagement (Clicks)"
                      />
                    </Box>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Campaign Controls */}
          <Box mb={6}>
            <HStack spacing={4} mb={4} justify="space-between" wrap="wrap">
              <Text fontSize="lg" fontWeight="semibold">
                All Campaigns ({filteredCampaigns.length} campaigns)
              </Text>
              <HStack spacing={4}>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={() => {
                    const csvContent = 'data:text/csv;charset=utf-8,' + 
                      // Header row
                      ['Campaign Name', 'Status', 'Budget', 'Conversion Rate'].join(',') + '\n' +
                      // Data rows
                      filteredCampaigns.map(campaign => [
                        campaign.name,
                        campaign.status,
                        campaign.budget,
                        campaign.conversionRate
                      ].join(',')).join('\n');

                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'campaigns_data.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Export Data
                </Button>
                <Button colorScheme="blue" size="sm">
                  Create Campaign
                </Button>
              </HStack>
            </HStack>

            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                maxW="200px"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="budget">Sort by Budget</option>
                <option value="conversionRate">Sort by Conversion</option>
                <option value="status">Sort by Status</option>
              </Select>
            </HStack>
          </Box>

          {/* Campaigns Table */}
          <Box
            bg={colorMode === 'dark' ? 'gray.700' : 'white'}
            borderRadius="lg"
            boxShadow="base"
            overflow="hidden"
          >
            {filteredCampaigns.length > 0 ? (
              <>
                <Table variant="simple" colorScheme={colorMode === 'dark' ? 'gray' : 'gray'}>
                  <Thead bg={colorMode === 'dark' ? 'gray.600' : 'gray.50'}>
                    <Tr>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Campaign Name</Th>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Status</Th>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Budget</Th>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Conversion Rate</Th>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Impressions</Th>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Clicks</Th>
                      <Th color={colorMode === 'dark' ? 'white' : 'gray.700'}>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredCampaigns
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((campaign, index) => (
                        <Tr key={campaign.id || index}>
                          <Td fontWeight="medium">
                            {campaign.name || `Campaign ${index + 1}`}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                campaign.status === 'active' ? 'green' : 
                                campaign.status === 'paused' ? 'orange' : 'blue'
                              }
                            >
                              {campaign.status || 'Unknown'}
                            </Badge>
                          </Td>
                          <Td>${(campaign.budget || 0).toLocaleString()}</Td>
                          <Td>{(campaign.conversionRate || 0).toFixed(1)}%</Td>
                          <Td>{(campaign.impressions || 0).toLocaleString()}</Td>
                          <Td>{(campaign.clicks || 0).toLocaleString()}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="xs" variant="outline">
                                Edit
                              </Button>
                              <Button size="xs" variant="outline" colorScheme="red">
                                Delete
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Pagination */}
                <Box p={4} borderTop="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}>
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
                    </Text>
                    <HStack>
                      <Button
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                        isDisabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
                        Page {currentPage} of {Math.ceil(filteredCampaigns.length / itemsPerPage)}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                        isDisabled={currentPage === Math.ceil(filteredCampaigns.length / itemsPerPage)}
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
                  No campaigns found
                </Text>
                <Button colorScheme="blue">
                  Create Your First Campaign
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Campaigns;
