import { Card, CardBody, Button } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";

export const ExportToPDFButton = () => {
  return (
    <Card>
      <CardBody display="flex" justifyContent="center">
        <Button leftIcon={<FiDownload />} colorScheme="blue" isDisabled>
          Export to PDF (Coming Soon)
        </Button>
      </CardBody>
    </Card>
  );
};
