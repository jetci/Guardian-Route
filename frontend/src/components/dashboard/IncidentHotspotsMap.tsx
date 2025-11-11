import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

export const IncidentHotspotsMap = () => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Incident Hotspots</Heading>
      </CardHeader>
      <CardBody>
        <Text color="gray.500">Map (Leaflet) - Coming Soon</Text>
      </CardBody>
    </Card>
  );
};
