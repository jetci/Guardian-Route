import { Box, Grid, GridItem, Heading, Text, Flex } from "@chakra-ui/react";
import { KPISummaryBar } from "../components/dashboard/KPISummaryBar";
import { TrendChart } from "../components/dashboard/TrendChart";
import { TypeDonutChart } from "../components/dashboard/TypeDonutChart";
import { CriticalIncidentsTable } from "../components/dashboard/CriticalIncidentsTable";
import { RiskHeatmap } from "../components/dashboard/RiskHeatmap";
import { ExportButton } from "../components/dashboard/ExportButton";

export const ExecutiveDashboardPage = () => {
  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading mb={2}>Executive Dashboard</Heading>
          <Text color="gray.600">
            Last Updated: {new Date().toLocaleString('th-TH')}
          </Text>
        </Box>
        <ExportButton />
      </Flex>
      
      <Grid
        templateAreas={{
          base: `"kpi" "trend" "type" "critical" "heatmap"`,
          lg: `"kpi kpi" "trend type" "critical critical" "heatmap heatmap"`,
        }}
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
      >
        <GridItem area="kpi">
          <KPISummaryBar />
        </GridItem>
        
        <GridItem area="trend">
          <TrendChart />
        </GridItem>
        
        <GridItem area="type">
          <TypeDonutChart />
        </GridItem>
        
        <GridItem area="critical">
          <CriticalIncidentsTable />
        </GridItem>
        
        <GridItem area="heatmap">
          <RiskHeatmap />
        </GridItem>
      </Grid>
    </Box>
  );
};
