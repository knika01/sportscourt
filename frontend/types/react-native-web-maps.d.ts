declare module 'react-native-web-maps' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export interface MapViewProps extends ViewProps {
    initialRegion?: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
    region?: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
    style?: any;
  }

  export const MapView: ComponentType<MapViewProps>;
} 