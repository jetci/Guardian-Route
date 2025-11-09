import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

export const IncidentsByPriorityChart = () => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Incidents by Priority</Heading>
      </CardHeader>
      <CardBody>
        <Text color="gray.500">Bar Chart (Recharts) - Coming Soon</Text>
      </CardBody>
    </Card>
  );
};
