import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

export const IncidentsByStatusChart = () => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Incidents by Status</Heading>
      </CardHeader>
      <CardBody>
        <Text color="gray.500">Donut Chart (Recharts) - Coming Soon</Text>
      </CardBody>
    </Card>
  );
};
