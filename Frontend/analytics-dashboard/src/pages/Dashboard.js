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
} from '@chakra-ui/react';
import api from '../services/api';
import LoadingState from '../components/LoadingState';
import MetricCard from '../components/MetricCard';

function Dashboard() {
  const [campaignData, setCampaignData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    checking: true,
    connected: false,
    message: 'Checking connection to server...'
  });

  const checkBackendConnection = useCallback(async () => {
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
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);  // Clear any previous errors
    
    try {
      // First check if server is running
      const isConnected = await checkBackendConnection();
      if (!isConnected) {
        return false;
      }

      // Try to fetch dashboard analytics first
      try {
        const analyticsResponse = await api.getDashboardAnalytics();
        if (analyticsResponse?.data) {
          console.log('Successfully received dashboard analytics:', analyticsResponse.data);
          setCampaignData(analyticsResponse.data.campaigns || []);
          setMarketingData(analyticsResponse.data.marketingData || []);
          return;
        }
      } catch (analyticsErr) {
        console.log('Dashboard analytics endpoint not available, falling back to individual endpoints');
        // If dashboard analytics fails, fall back to individual endpoints
      }

      // Fallback: fetch individual data sources
      const [campaignResponse, marketingResponse] = await Promise.all([
        api.getCampaigns().then(res => ({ data: res.data?.data || [] })),
        api.getMarketingData().then(res => ({ data: res.data?.data || [] }))
      ]);
      
      // Process campaign data with validation
      let processedCampaignData = [];
      if (campaignResponse?.data) {
        // Handle array or nested data structure
        processedCampaignData = Array.isArray(campaignResponse.data) 
          ? campaignResponse.data 
          : (campaignResponse.data.data || []);
      }
      
      // Process marketing data with validation
      let processedMarketingData = [];
      if (marketingResponse?.data) {
        // Handle array or nested data structure
        processedMarketingData = Array.isArray(marketingResponse.data)
          ? marketingResponse.data
          : (marketingResponse.data.data || []);
      }

      console.log('Successfully received data:', {
        campaigns: processedCampaignData,
        marketingData: processedMarketingData
      });
      
      setCampaignData(processedCampaignData);
      setMarketingData(processedMarketingData);
    } catch (err) {
      console.error('Error fetching dashboard data:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be overloaded.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check if the backend server is running.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check server configuration.');
      } else {
        setError(`Failed to load dashboard data: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [checkBackendConnection]);

  // Function to retry connection
  const retryConnection = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setConnectionStatus({
      checking: true,
      connected: false,
      message: 'Retrying connection to server...'
    });
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    // Initial data fetch when component mounts
    fetchDashboardData();
    
    // Optional: Set up periodic refresh (uncomment if needed)
    // const refreshInterval = setInterval(() => {
    //   fetchDashboardData();
    // }, 60000); // Refresh every minute
    // 
    // return () => clearInterval(refreshInterval);
  }, [fetchDashboardData]);

  const calculateMetrics = () => {
    if (!marketingData.length) {
      return {
        totalRevenue: 0,
        conversionRate: 0,
        customerAcquisitionCost: 0
      };
    }

    // Safety check for data structure
    const validateNumber = (value) => typeof value === 'number' && !isNaN(value) ? value : 0;

    const totalRevenue = marketingData.reduce((sum, data) => {
      return sum + validateNumber(data.revenue || data.Revenue || 0);
    }, 0);

    const conversionRate = marketingData.reduce((sum, data) => {
      return sum + validateNumber(data.conversionRate || data.conversion_rate || data.ConversionRate || 0);
    }, 0) / marketingData.length;

    const customerAcquisitionCost = marketingData.reduce((sum, data) => {
      return sum + validateNumber(data.acquisitionCost || data.acquisition_cost || data.CustomerAcquisitionCost || 0);
    }, 0) / marketingData.length;
    
    return {
      totalRevenue,
      conversionRate,
      customerAcquisitionCost
    };
  };

  const metrics = calculateMetrics();

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
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <MetricCard
              title="Total Campaigns"
              value={campaignData.length}
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

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
            <Box
              p={6}
              borderRadius="lg"
              boxShadow="base"
              bg="white"
            >
              <Heading size="md" mb={4}>Campaign Performance</Heading>
              <Text>
                {campaignData.length 
                  ? `Analyzing performance of ${campaignData.length} campaigns`
                  : 'No campaign data available'}
              </Text>
            </Box>

            <Box
              p={6}
              borderRadius="lg"
              boxShadow="base"
              bg="white"
            >
              <Heading size="md" mb={4}>Marketing Insights</Heading>
              <Text>
                {marketingData.length 
                  ? `Analyzing ${marketingData.length} marketing data points`
                  : 'No marketing data available'}
              </Text>
            </Box>
          </Grid>
        </>
      )}
    </Container>
  );
}

export default Dashboard;
