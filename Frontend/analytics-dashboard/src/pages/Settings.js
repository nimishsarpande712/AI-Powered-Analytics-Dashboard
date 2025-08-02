import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Button,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Card,
  CardHeader,
  CardBody,
  useColorMode
} from '@chakra-ui/react';
import MetricCard from '../components/MetricCard';

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  const [settings, setSettings] = useState({
    theme: colorMode || 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    dataRetention: 90,
    exportFormat: 'csv',
    showPercentages: true,
    showAnimations: true,
    compactView: false,
  });
  
  // Sync settings with colorMode
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: colorMode
    }));
  }, [colorMode]);

  const toast = useToast();

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30,
      dataRetention: 90,
      exportFormat: 'csv',
      showPercentages: true,
      showAnimations: true,
      compactView: false,
    });
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to defaults.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>
        Settings
      </Heading>

      {/* Settings Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <MetricCard
          title="Active Users"
          value="1"
          percentageChange={0}
          delay={0}
        />
        <MetricCard
          title="Data Sources"
          value="2"
          percentageChange={0}
          delay={100}
        />
        <MetricCard
          title="API Calls Today"
          value="156"
          percentageChange={12.5}
          delay={200}
        />
        <MetricCard
          title="Storage Used"
          value="2.4 GB"
          percentageChange={8.3}
          delay={300}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* General Settings */}
        <Card>
          <CardHeader>
            <Heading size="md">General Settings</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="theme" mb="0" flex="1">
                  Theme
                </FormLabel>
                <Select
                  id="theme"
                  value={settings.theme}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    handleSettingChange('theme', newTheme);
                    
                    // Toggle color mode if different from current
                    if ((newTheme === 'dark' && colorMode === 'light') || 
                        (newTheme === 'light' && colorMode === 'dark')) {
                      toggleColorMode();
                    }
                  }}
                  maxW="150px"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="notifications" mb="0" flex="1">
                  Enable Notifications
                </FormLabel>
                <Switch
                  id="notifications"
                  isChecked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="animations" mb="0" flex="1">
                  Show Animations
                </FormLabel>
                <Switch
                  id="animations"
                  isChecked={settings.showAnimations}
                  onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="compact" mb="0" flex="1">
                  Compact View
                </FormLabel>
                <Switch
                  id="compact"
                  isChecked={settings.compactView}
                  onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Data Settings */}
        <Card>
          <CardHeader>
            <Heading size="md">Data Settings</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="autoRefresh" mb="0" flex="1">
                  Auto Refresh Data
                </FormLabel>
                <Switch
                  id="autoRefresh"
                  isChecked={settings.autoRefresh}
                  onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="refreshInterval" mb="0" flex="1">
                  Refresh Interval (seconds)
                </FormLabel>
                <Select
                  id="refreshInterval"
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                  maxW="150px"
                  isDisabled={!settings.autoRefresh}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="300">300</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="dataRetention" mb="0" flex="1">
                  Data Retention (days)
                </FormLabel>
                <Select
                  id="dataRetention"
                  value={settings.dataRetention}
                  onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                  maxW="150px"
                >
                  <option value="30">30</option>
                  <option value="90">90</option>
                  <option value="180">180</option>
                  <option value="365">365</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="exportFormat" mb="0" flex="1">
                  Default Export Format
                </FormLabel>
                <Select
                  id="exportFormat"
                  value={settings.exportFormat}
                  onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                  maxW="150px"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </Select>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <Heading size="md">System Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text color="gray.600">Version:</Text>
                <Text fontWeight="semibold">1.0.0</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.600">Last Updated:</Text>
                <Text fontWeight="semibold">2025-08-02</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.600">Database:</Text>
                <Text fontWeight="semibold">MySQL 8.0</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.600">API Status:</Text>
                <Text fontWeight="semibold" color="green.500">Active</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Danger Zone */}
        <Card borderColor="red.200">
          <CardHeader>
            <Heading size="md" color="red.500">Danger Zone</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="semibold">Clear All Data</Text>
                  <Text fontSize="sm">This will permanently delete all dashboard data.</Text>
                </Box>
              </Alert>
              <Button colorScheme="red" variant="outline" size="sm">
                Clear All Data
              </Button>
              <Button colorScheme="red" variant="outline" size="sm">
                Reset Database
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Divider my={8} />

      {/* Action Buttons */}
      <HStack spacing={4} justify="flex-end">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
        <Button colorScheme="blue" onClick={saveSettings}>
          Save Settings
        </Button>
      </HStack>
    </Container>
  );
};

export default Settings;
