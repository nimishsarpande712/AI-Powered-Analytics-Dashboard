import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Container,
  Grid,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  HStack,
  useColorMode,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Flex
} from '@chakra-ui/react';
import api from '../services/api';
import LoadingState from '../components/LoadingState';
import MetricCard from '../components/MetricCard';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import DonutChart from '../components/charts/DonutChart';
import LineChart from '../components/charts/LineChart';
import ChartContainer from '../components/ChartContainer';

function Dashboard() {
  const { colorMode } = useColorMode();
  const [campaignData, setCampaignData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState({
    checking: true,
    connected: false,
    message: 'Checking connection to server...'
  });

  // Set mock data for development/demo purposes
  const setMockData = () => {
    console.log("Setting mock data for dashboard visualization");
    
    const mockCampaigns = [
      { id: 1, name: "Summer Sale", status: "active", conversionRate: 5.7, budget: 12000, impressions: 45000, clicks: 2800, revenue: 35000 },
      { id: 2, name: "Holiday Special", status: "paused", conversionRate: 3.2, budget: 8000, impressions: 32000, clicks: 1500, revenue: 18000 },
      { id: 3, name: "New Product Launch", status: "active", conversionRate: 7.1, budget: 15000, impressions: 60000, clicks: 3200, revenue: 42000 },
      { id: 4, name: "End of Season", status: "completed", conversionRate: 4.5, budget: 9000, impressions: 37500, clicks: 1850, revenue: 22000 },
      { id: 5, name: "Flash Sale", status: "active", conversionRate: 8.3, budget: 6000, impressions: 28000, clicks: 2100, revenue: 15000 },
    ];

    const mockMarketingData = [
      { id: 1, channel: "Social Media", conversionRate: 3.8, acquisitionCost: 14.5, engagement: 18500, revenue: 28000 },
      { id: 2, channel: "Email", conversionRate: 5.2, acquisitionCost: 9.8, engagement: 12000, revenue: 32000 },
      { id: 3, channel: "Search", conversionRate: 7.5, acquisitionCost: 12.3, engagement: 24000, revenue: 56000 },
      { id: 4, channel: "Display Ads", conversionRate: 2.1, acquisitionCost: 18.7, engagement: 45000, revenue: 22000 },
      { id: 5, channel: "Affiliates", conversionRate: 4.2, acquisitionCost: 11.2, engagement: 8500, revenue: 18000 }
    ];

    // Ensure data is correctly processed
    setCampaignData(mockCampaigns);
    setMarketingData(mockMarketingData);
    console.log("Mock data has been set successfully", { mockCampaigns, mockMarketingData });
  };

  // Function to retry connection
  const retryConnection = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setConnectionStatus({
      checking: true,
      connected: false,
      message: 'Retrying connection to server...'
    });
    
    // Create a simple retry mechanism without causing infinite loops
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      // Check backend connection inline to avoid circular dependency
      const checkConnection = async () => {
        try {
          setConnectionStatus({
            checking: true,
            connected: false,
            message: 'Checking connection to server...'
          });
          
          const healthStatus = await api.checkHealth();
          
          if (healthStatus.isHealthy) {
            setConnectionStatus({
              checking: false,
              connected: true,
              message: healthStatus.message || 'Connected to backend server',
              data: healthStatus.data
            });
            return true;
          } else {
            setConnectionStatus({
              checking: false,
              connected: false,
              message: healthStatus.message || 'Backend server is not responding properly',
              data: healthStatus.data
            });
            setError('Network error. Please check if the backend server is running.');
            return false;
          }
        } catch (err) {
          console.error('Connection check error:', err);
          setConnectionStatus({
            checking: false,
            connected: false,
            message: `Failed to connect: ${err.message}`,
          });
          setError('Network error. Please check if the backend server is running.');
          return false;
        }
      };
      
      try {
        // First check if server is running
        const isConnected = await checkConnection();
        if (!isConnected) {
          // Do not use mock data, just show error
          setIsLoading(false);
          setError('Backend server is not responding. Please check if it is running.');
          return false;
        }


        // Fetch campaign and marketing data directly
        try {
          // Try to get stats first which provides more comprehensive data
          const [campaignRes, marketingRes, statsRes] = await Promise.all([
            api.getCampaigns(),
            api.getMarketingData(),
            api.getStats().catch(e => ({ data: null })) // Optional stats endpoint
          ]);
          if (!isMounted) return;
          
          // Process campaign data
          const rawCampaigns = Array.isArray(campaignRes.data) ? campaignRes.data : (campaignRes.data?.data || []);
          const normalizedCampaigns = rawCampaigns.map(c => ({
            id: c.id,
            name: c.campaignName || c.name || 'Unnamed Campaign',
            status: (c.status || '').toLowerCase(),
            channel: c.channel || 'Other',
            conversionRate: parseFloat(c.conversionRate || c.conversion_rate || 0),
            budget: parseFloat(c.spend || c.budget || 0),
            revenue: parseFloat(c.revenue || 0),
            impressions: parseInt(c.impressions || 0, 10),
            clicks: parseInt(c.clicks || 0, 10)
          }));
          setCampaignData(normalizedCampaigns);
          
          // Create proper marketing channel data structure for charts
          let marketingChannels = [];
          
          // If we have stats data with demographics, use that
          if (statsRes?.data?.data?.demographics) {
            const { education, maritalStatus } = statsRes.data.data.demographics;
            
            // Transform education stats to marketing channels
            if (Array.isArray(education)) {
              education.forEach(item => {
                marketingChannels.push({
                  id: `edu-${item.Education}`,
                  channel: item.Education || 'Unknown Education',
                  conversionRate: 5.0, // Default conversion rate
                  acquisitionCost: 10.0, // Default acquisition cost
                  engagement: parseInt(item.count || 0, 10),
                  revenue: parseFloat(item.avgIncome || 0) * 0.1 // 10% of income as revenue (estimation)
                });
              });
            }
            
            // Transform marital status stats to marketing channels
            if (Array.isArray(maritalStatus)) {
              maritalStatus.forEach(item => {
                marketingChannels.push({
                  id: `ms-${item.Marital_Status}`,
                  channel: item.Marital_Status || 'Unknown Status',
                  conversionRate: (parseInt(item.conversions || 0) / parseInt(item.count || 1)) * 100,
                  acquisitionCost: 15.0, // Default acquisition cost
                  engagement: parseInt(item.count || 0, 10),
                  revenue: parseFloat(item.count || 0) * 10 // $10 per customer (estimation)
                });
              });
            }
            
            // If we have spending data, add that as marketing channels too
            if (statsRes.data.data.spendingBreakdown) {
              const spending = statsRes.data.data.spendingBreakdown;
              
              Object.entries(spending).forEach(([category, amount]) => {
                if (amount > 0) {
                  marketingChannels.push({
                    id: `spend-${category}`,
                    channel: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
                    conversionRate: 7.5, // Default conversion rate
                    acquisitionCost: 12.0, // Default acquisition cost
                    engagement: Math.round(amount / 10), // Estimate engagement based on spending
                    revenue: parseFloat(amount)
                  });
                }
              });
            }
          }
          
          // If no stats data or if marketing channels is still empty, fall back to marketing data
          if (marketingChannels.length === 0) {
            const rawMarketing = marketingRes.data?.data || marketingRes.data || [];
            
            if (Array.isArray(rawMarketing) && rawMarketing.length > 0) {
              marketingChannels = rawMarketing.map(item => {
                // Create proper channel names from whatever data we have
                const channelName = item.channel || 
                                  item.Education || 
                                  item.Marital_Status || 
                                  (item.ID ? `Customer ${item.ID}` : 'Unknown');
                
                return {
                  id: item.id || Math.random().toString(36).substring(2),
                  channel: channelName,
                  conversionRate: parseFloat(item.conversionRate || item.conversion_rate || 5),
                  acquisitionCost: parseFloat(item.acquisitionCost || item.acquisition_cost || 10),
                  engagement: parseInt(item.engagement || item.count || item.NumWebVisitsMonth || 100, 10),
                  revenue: parseFloat(item.revenue || item.Z_Revenue || item.MntWines || item.totalSpend || 20)
                };
              });
            }
          }
          
          setMarketingData(marketingChannels);
          console.log('Processed marketing data for charts:', marketingChannels);
          console.log('Processed campaign data:', normalizedCampaigns);
        } catch (fetchErr) {
          console.error('Error fetching dashboard data directly:', fetchErr);
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        if (isMounted) {
          // Don't use mock data, show specific error messages
          if (err.code === 'ECONNABORTED') {
            setError('Request timed out. The server might be overloaded.');
          } else if (err.code === 'ERR_NETWORK') {
            setError('Network error. Please check if the backend server is running.');
          } else if (err.response?.status === 404) {
            setError('API endpoint not found. Please check server configuration.');
          } else {
            setError(`Failed to load dashboard data: ${err.message}`);
          }
          console.log('Connection failed, showing error message');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial data fetch
    loadData();
    
    // Set up periodic refresh every 10 minutes (reduced frequency to prevent overload)
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }, 600000); // 10 minutes
    
    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  const calculateMetrics = () => {
    const totalCampaigns = campaignData.length;
    const activeCampaigns = campaignData.filter(c => c.status === 'active').length;

    if (!marketingData.length && !campaignData.length) {
      return {
        totalRevenue: 0,
        conversionRate: 0,
        customerAcquisitionCost: 0,
        totalCampaigns: 0,
        activeCampaigns: 0
      };
    }

    // Helper function to validate numbers with more precision
    const validateNumber = (value) => {
      const num = parseFloat(value);
      return typeof num === 'number' && !isNaN(num) && isFinite(num) ? num : 0;
    };

    // Calculate total revenue from both campaigns and marketing channels
    const campaignRevenue = campaignData.reduce((sum, data) => sum + validateNumber(data.revenue), 0);
    const marketingRevenue = marketingData.reduce((sum, data) => sum + validateNumber(data.revenue), 0);
    const totalRevenue = campaignRevenue + marketingRevenue;

    // Calculate weighted average conversion rate
    const totalImpressions = campaignData.reduce((sum, data) => sum + validateNumber(data.impressions), 0);
    const weightedConversionRate = campaignData.reduce((sum, data) => {
      const impressions = validateNumber(data.impressions);
      return sum + (validateNumber(data.conversionRate) * (impressions / totalImpressions));
    }, 0);
    const conversionRate = totalImpressions > 0 ? weightedConversionRate : 0;

    // Calculate average acquisition cost
    const totalAcquisitionCost = marketingData.reduce((sum, data) => {
      return sum + validateNumber(data.acquisitionCost);
    }, 0);
    const customerAcquisitionCost = marketingData.length > 0 ? totalAcquisitionCost / marketingData.length : 0;
    
    return {
      totalRevenue,
      conversionRate,
      customerAcquisitionCost,
      totalCampaigns,
      activeCampaigns
    };
  };

  // Prepare data for charts

  const prepareMarketingChannelData = () => {
    if (!marketingData || marketingData.length === 0) return [];
    
    // Group by channel and sum revenues
    const channelRevenue = marketingData.reduce((acc, item) => {
      if (!item.channel || item.revenue === undefined) return acc;
      
      const channel = item.channel;
      const revenue = parseFloat(item.revenue || 0);
      
      if (isNaN(revenue)) return acc;
      
      acc[channel] = (acc[channel] || 0) + revenue;
      return acc;
    }, {});
    
    // Convert to array of objects and sort
    return Object.entries(channelRevenue)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Limit to top 10 channels
  };

  const prepareConversionRateData = () => {
    if (!marketingData || marketingData.length === 0) return [];
    
    // Group by channel and average conversion rates
    const channelData = marketingData.reduce((acc, item) => {
      if (!item.channel || item.conversionRate === undefined) return acc;
      
      const channel = item.channel;
      const rate = parseFloat(item.conversionRate || 0);
      
      if (isNaN(rate) || rate <= 0) return acc;
      
      if (!acc[channel]) {
        acc[channel] = { total: rate, count: 1 };
      } else {
        acc[channel].total += rate;
        acc[channel].count += 1;
      }
      
      return acc;
    }, {});
    
    // Calculate averages and convert to array
    return Object.entries(channelData)
      .map(([name, { total, count }]) => ({ 
        name, 
        value: total / count 
      }))
      .filter(item => !isNaN(item.value) && item.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by highest conversion rate
  };

  const prepareAcquisitionCostData = () => {
    if (!marketingData || marketingData.length === 0) return [];
    
    // Group by channel and average acquisition costs
    const channelData = marketingData.reduce((acc, item) => {
      if (!item.channel || item.acquisitionCost === undefined) return acc;
      
      const channel = item.channel;
      const cost = parseFloat(item.acquisitionCost || 0);
      
      if (isNaN(cost) || cost <= 0) return acc;
      
      if (!acc[channel]) {
        acc[channel] = { total: cost, count: 1 };
      } else {
        acc[channel].total += cost;
        acc[channel].count += 1;
      }
      
      return acc;
    }, {});
    
    // Calculate averages and convert to array
    return Object.entries(channelData)
      .map(([name, { total, count }]) => ({ 
        name, 
        value: total / count 
      }))
      .filter(item => !isNaN(item.value) && item.value > 0)
      .sort((a, b) => a.value - b.value); // Sort by lowest acquisition cost first
  };
  
  // Prepare engagement data for line/bar chart
  const prepareEngagementData = () => {
    if (!marketingData || marketingData.length === 0) return [];
    
    return marketingData
      .filter(item => item.channel && item.engagement !== undefined)
      .map(item => ({
        name: item.channel,
        engagement: parseInt(item.engagement || 0, 10)
      }))
      .filter(item => !isNaN(item.engagement) && item.engagement > 0)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 8); // Top 8 for readability
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Heading as="h2" size="lg" color="red.500" mb={4}>
          Error Loading Dashboard
        </Heading>
        <Text mb={6}>{error}</Text>
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Connection Status</AlertTitle>
            <AlertDescription>{connectionStatus.message}</AlertDescription>
          </Box>
        </Alert>
        <Button colorScheme="blue" onClick={retryConnection}>
          Retry Connection
        </Button>

        {/* No visualization with mock data */}
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={4}>
        AI Analytics Dashboard
      </Heading>
      
      {/* Connection status indicator */}
      <Box mb={6}>
        <Alert 
          status={connectionStatus.connected ? "success" : "warning"}
          variant="subtle"
          borderRadius="md"
        >
          <AlertIcon />
          <HStack>
            {connectionStatus.checking && <Spinner size="sm" />}
            <Text>{connectionStatus.message}</Text>
          </HStack>
        </Alert>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <MetricCard
          title="Total Campaigns"
          value={metrics.totalCampaigns}
          percentageChange={23.36}
          delay={0}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          percentageChange={5.2}
          delay={100}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          percentageChange={12.3}
          delay={200}
        />
        <MetricCard
          title="Acquisition Cost"
          value={`$${metrics.customerAcquisitionCost.toFixed(2)}`}
          percentageChange={-9.05}
          delay={300}
        />
      </SimpleGrid>

      {/* Chart Tabs */}
      <Tabs 
        variant="enclosed" 
        colorScheme="blue" 
        onChange={setActiveChartTab}
        index={activeChartTab}
        mb={6}
        isLazy
      >
        <TabList>
          <Tab>Channels</Tab>
          <Tab>Conversion</Tab>
          <Tab>Acquisition Cost</Tab>
        </TabList>

        <TabPanels>

          <TabPanel p={0} pt={4}>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
              <ChartContainer title="Channel Distribution" height="400px">
                {(marketingData && marketingData.length > 0 && prepareMarketingChannelData().length > 0) ? (
                  <DonutChart 
                    data={prepareMarketingChannelData()} 
                    dataKey="value" 
                    nameKey="name"
                    colorMode={colorMode}
                  />
                ) : (
                  <Flex align="center" justify="center" height="100%">
                    <Text>No marketing channel data available</Text>
                  </Flex>
                )}
              </ChartContainer>
              
              <ChartContainer title="Channel Engagement" height="400px">
                {(marketingData && marketingData.length > 0) ? (
                  <LineChart 
                    data={marketingData
                      .filter(item => item.channel && item.engagement !== undefined)
                      .map((item, index) => ({
                        name: item.channel || 'Unknown',
                        engagement: parseInt(item.engagement || 0, 10),
                        index: index + 1
                      }))
                      .filter(item => !isNaN(item.engagement) && item.engagement > 0)
                    }
                    xAxisKey="index" 
                    dataKey="engagement"
                    colorMode={colorMode}
                  />
                ) : (
                  <Flex align="center" justify="center" height="100%">
                    <Text>No engagement data available</Text>
                  </Flex>
                )}
              </ChartContainer>
            </Grid>
          </TabPanel>

          <TabPanel p={0} pt={4}>
            <Grid templateColumns={{ base: "1fr" }} gap={6}>
              <ChartContainer title="Conversion Rate by Channel" height="400px">
                {(marketingData && marketingData.length > 0 && prepareConversionRateData().length > 0) ? (
                  <BarChart 
                    data={prepareConversionRateData().map(item => ({
                      name: item.name || 'Unknown',
                      rate: parseFloat(item.value || 0)
                    }))} 
                    xDataKey="name" 
                    barDataKey="rate"
                    colorMode={colorMode}
                  />
                ) : (
                  <Flex align="center" justify="center" height="100%">
                    <Text>No conversion rate data available</Text>
                  </Flex>
                )}
              </ChartContainer>
            </Grid>
          </TabPanel>

          <TabPanel p={0} pt={4}>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              <ChartContainer title="Acquisition Cost by Channel" height="400px">
                {(marketingData && marketingData.length > 0 && prepareAcquisitionCostData().length > 0) ? (
                  <BarChart 
                    data={prepareAcquisitionCostData().map(item => ({
                      name: item.name || 'Unknown',
                      cost: parseFloat(item.value || 0)
                    }))} 
                    xDataKey="name" 
                    barDataKey="cost"
                    colorMode={colorMode}
                  />
                ) : (
                  <Flex align="center" justify="center" height="100%">
                    <Text>No acquisition cost data available</Text>
                  </Flex>
                )}
              </ChartContainer>
              
              <ChartContainer title="Cost Distribution" height="400px">
                {(marketingData && marketingData.length > 0 && prepareAcquisitionCostData().length > 0) ? (
                  <DonutChart 
                    data={prepareAcquisitionCostData()} 
                    dataKey="value" 
                    nameKey="name"
                    colorMode={colorMode}
                  />
                ) : (
                  <Flex align="center" justify="center" height="100%">
                    <Text>No cost distribution data available</Text>
                  </Flex>
                )}
              </ChartContainer>
              
              <ChartContainer title="Engagement Trends" height="400px">
                {(marketingData && marketingData.length > 0 && prepareEngagementData().length > 0) ? (
                  <LineChart 
                    data={prepareEngagementData().map((item, index) => ({
                      ...item,
                      index: index + 1
                    }))}
                    xAxisKey="index" 
                    dataKey="engagement"
                    colorMode={colorMode}
                  />
                ) : (
                  <Flex align="center" justify="center" height="100%">
                    <Text>No engagement trend data available</Text>
                  </Flex>
                )}
              </ChartContainer>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Dashboard;
