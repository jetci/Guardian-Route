import { FormControl, FormLabel, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';
import { SimplePhotoUpload } from './SimplePhotoUpload';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step9Photos = ({ data, onChange }: Props) => {
  const handlePhotosChange = (urls: string[]) => {
    onChange({ photoUrls: urls });
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>รูปภาพประกอบ</FormLabel>
        <SimplePhotoUpload
          photos={data.photoUrls || []}
          onPhotosChange={handlePhotosChange}
        />
      </FormControl>
    </VStack>
  );
};
