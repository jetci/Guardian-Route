import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { KPISummaryBar } from "../components/dashboard/KPISummaryBar";
import { IncidentsByStatusChart } from "../components/dashboard/IncidentsByStatusChart";
import { IncidentsByPriorityChart } from "../components/dashboard/IncidentsByPriorityChart";
import { IncidentHotspotsMap } from "../components/dashboard/IncidentHotspotsMap";
import { IncidentTrendChart } from "../components/dashboard/IncidentTrendChart";
import { FieldOfficerWorkloadTable } from "../components/dashboard/FieldOfficerWorkloadTable";
import { ExportToPDFButton } from "../components/dashboard/ExportToPDFButton";

export const ExecutiveDashboardPage = () => {
  return (
    <Box p={6}>
      <Heading mb={6}>Executive Dashboard</Heading>
      <Text mb={4} color="gray.600">
        Last Updated: {new Date().toLocaleString()}
      </Text>
      
      <Grid
        templateAreas={{
          base: `"kpi" "status" "priority" "trend" "map" "workload" "export"`,
          lg: `"kpi kpi" "status trend" "priority map" "workload workload" "export export"`,
        }}
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
      >
        <GridItem area="kpi">
          <KPISummaryBar />
        </GridItem>
        
        <GridItem area="status">
          <IncidentsByStatusChart />
        </GridItem>
        
        <GridItem area="trend">
          <IncidentTrendChart />
        </GridItem>
        
        <GridItem area="priority">
          <IncidentsByPriorityChart />
        </GridItem>
        
        <GridItem area="map">
          <IncidentHotspotsMap />
        </GridItem>
        
        <GridItem area="workload">
          <FieldOfficerWorkloadTable />
        </GridItem>
        
        <GridItem area="export">
          <ExportToPDFButton />
        </GridItem>
      </Grid>
    </Box>
  );
};
