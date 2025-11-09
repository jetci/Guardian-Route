import mapConfigJson from './mapConfig.json';

export interface MapCenter {
  lat: number;
  lng: number;
  description: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface TileLayer {
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export interface MarkerIcons {
  incident: {
    default: string;
    flood: string;
    fire: string;
    landslide: string;
    earthquake: string;
    storm: string;
    drought: string;
    other: string;
  };
  village: string;
  user: string;
}

export interface PolygonStyle {
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
}

export interface MapConfig {
  defaultCenter: MapCenter;
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
  bounds: MapBounds;
  tileLayers: {
    default: TileLayer;
    satellite: TileLayer;
    terrain: TileLayer;
  };
  markerIcons: MarkerIcons;
  polygonStyles: {
    village: PolygonStyle;
    riskArea: {
      low: PolygonStyle;
      medium: PolygonStyle;
      high: PolygonStyle;
    };
  };
  clustering: {
    enabled: boolean;
    maxClusterRadius: number;
    disableClusteringAtZoom: number;
  };
  geolocation: {
    enabled: boolean;
    watch: boolean;
    setView: boolean;
    maxZoom: number;
    timeout: number;
    maximumAge: number;
    enableHighAccuracy: boolean;
  };
  offline: {
    enabled: boolean;
    maxTilesToCache: number;
    tileExpirationDays: number;
  };
}

export const mapConfig: MapConfig = mapConfigJson as MapConfig;

export default mapConfig;
