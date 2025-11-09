import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  IconButton,
  Tooltip,
  Text,
  useToast,
  Badge,
} from '@chakra-ui/react';
import {
  FiSave,
  FiRotateCcw,
  FiRotateCw,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface PolygonEditorWithUndoProps {
  initialGeojson?: any;
  onSave: (geojson: any) => void;
  onCancel: () => void;
}

interface HistoryState {
  geojson: any;
  timestamp: number;
}

const MAX_HISTORY = 50; // สูงสุด 50 actions

export const PolygonEditorWithUndo: React.FC<PolygonEditorWithUndoProps> = ({
  initialGeojson,
  onSave,
  onCancel,
}) => {
  const toast = useToast();
  const [currentGeojson, setCurrentGeojson] = useState<any>(
    initialGeojson || null,
  );
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize history
  useEffect(() => {
    if (initialGeojson) {
      const initialState: HistoryState = {
        geojson: initialGeojson,
        timestamp: Date.now(),
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [initialGeojson]);

  // Add to history
  const addToHistory = useCallback((geojson: any) => {
    setHistory((prev) => {
      // Remove future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);

      // Add new state
      newHistory.push({
        geojson,
        timestamp: Date.now(),
      });

      // Keep only last MAX_HISTORY items
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(-MAX_HISTORY);
      }

      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    setHasChanges(true);
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentGeojson(history[newIndex].geojson);
      toast({
        title: 'Undo สำเร็จ',
        status: 'info',
        duration: 1000,
      });
    }
  }, [historyIndex, history, toast]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentGeojson(history[newIndex].geojson);
      toast({
        title: 'Redo สำเร็จ',
        status: 'info',
        duration: 1000,
      });
    }
  }, [historyIndex, history, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Shift+Z or Cmd+Shift+Z for Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl+Y or Cmd+Y for Redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle map edits
  const handleCreated = (e: any) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    setCurrentGeojson(geojson);
    addToHistory(geojson);
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      const geojson = layer.toGeoJSON();
      setCurrentGeojson(geojson);
      addToHistory(geojson);
    });
  };

  const handleDeleted = (e: any) => {
    setCurrentGeojson(null);
    addToHistory(null);
  };

  const handleSave = () => {
    if (!currentGeojson) {
      toast({
        title: 'ไม่มีข้อมูลที่จะบันทึก',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    onSave(currentGeojson);
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          'มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการยกเลิกหรือไม่?',
        )
      ) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <VStack align="stretch" spacing={4} h="600px">
      {/* Toolbar */}
      <HStack justify="space-between" p={4} bg="gray.50" borderRadius="md">
        <HStack spacing={2}>
          <Tooltip label="Undo (Ctrl+Z)">
            <IconButton
              aria-label="Undo"
              icon={<FiRotateCcw />}
              onClick={handleUndo}
              isDisabled={!canUndo}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Redo (Ctrl+Y)">
            <IconButton
              aria-label="Redo"
              icon={<FiRotateCw />}
              onClick={handleRedo}
              isDisabled={!canRedo}
              size="sm"
            />
          </Tooltip>
          <Badge ml={2}>
            History: {historyIndex + 1}/{history.length}
          </Badge>
        </HStack>

        <HStack spacing={2}>
          {hasChanges && (
            <Badge colorScheme="orange">มีการเปลี่ยนแปลง</Badge>
          )}
          <Button
            leftIcon={<FiX />}
            onClick={handleCancel}
            size="sm"
            variant="ghost"
          >
            ยกเลิก
          </Button>
          <Button
            leftIcon={<FiSave />}
            onClick={handleSave}
            colorScheme="blue"
            size="sm"
            isDisabled={!hasChanges}
          >
            บันทึก
          </Button>
        </HStack>
      </HStack>

      {/* Map */}
      <Box flex={1} borderWidth="1px" borderRadius="md" overflow="hidden">
        <MapContainer
          center={[18.7883, 98.9853]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                rectangle: true,
                circle: true,
                circlemarker: false,
                marker: true,
                polyline: true,
                polygon: true,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </Box>

      {/* Instructions */}
      <Box p={3} bg="blue.50" borderRadius="md" fontSize="sm">
        <Text fontWeight="bold" mb={1}>
          คำแนะนำ:
        </Text>
        <Text>
          • ใช้เครื่องมือด้านขวาบนแผนที่เพื่อวาด/แก้ไข Polygon
        </Text>
        <Text>• Ctrl+Z เพื่อ Undo, Ctrl+Y เพื่อ Redo</Text>
        <Text>• ระบบจะเก็บประวัติไว้สูงสุด {MAX_HISTORY} actions</Text>
      </Box>
    </VStack>
  );
};
