import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from '@chakra-ui/react';
import GeoJSONUploader from './GeoJSONUploader';
import GeoJSONList from './GeoJSONList';

const GeoJSONManagement: React.FC = () => {
  return (
    <Box>
      <Heading size="md" mb={4}>
        จัดการขอบเขตภูมิศาสตร์
      </Heading>

      <Tabs colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>อัพโหลด GeoJSON</Tab>
          <Tab>รายการ GeoJSON</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <GeoJSONUploader />
          </TabPanel>

          <TabPanel>
            <GeoJSONList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GeoJSONManagement;
