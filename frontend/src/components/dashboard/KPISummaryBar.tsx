import { useEffect, useState } from "react";
import { Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { analyticsApi, type KpiSummary } from "../../api/analytics";

export const KPISummaryBar = () => {
  const [data, setData] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await analyticsApi.getKpiSummary();
        setData(result);
      } catch (err) {
        setError("Failed to load KPI data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardBody display="flex" justifyContent="center" alignItems="center" minH="150px">
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardBody>
          <Alert status="error">
            <AlertIcon />
            {error || "No data available"}
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          <Stat>
            <StatLabel>Total</StatLabel>
            <StatNumber>{data.total}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Pending</StatLabel>
            <StatNumber color="yellow.500">{data.pending}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Investigating</StatLabel>
            <StatNumber color="blue.500">{data.investigating}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Resolved</StatLabel>
            <StatNumber color="green.500">{data.resolved}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Avg Resolution</StatLabel>
            <StatNumber fontSize="lg">{data.avgResolutionTime}</StatNumber>
          </Stat>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};
