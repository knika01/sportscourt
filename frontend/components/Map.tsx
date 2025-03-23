import { Platform } from 'react-native';
import MapView from 'react-native-maps';
import { MapView as WebMapView } from 'react-native-web-maps';

// Use the appropriate MapView component based on platform
const Map = Platform.select({
  web: WebMapView,
  default: MapView,
});

export default Map; 