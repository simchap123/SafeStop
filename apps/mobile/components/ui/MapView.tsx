import React from "react";
import { Platform, View, Text } from "react-native";

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
}

export interface MapViewProps {
  latitude: number;
  longitude: number;
  markers?: MapMarker[];
  height?: number;
  showPin?: boolean;
}

function WebMap({ latitude, longitude, markers = [], height = 200, showPin = true }: MapViewProps) {
  const lat = latitude;
  const lng = longitude;
  const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
  const markerParam = showPin ? `&marker=${lat},${lng}` : "";
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markerParam}`;

  return (
    <iframe
      src={mapUrl}
      style={{
        width: "100%",
        height,
        border: "none",
        borderRadius: 16,
      }}
      title="Map"
    />
  );
}

function NativeMap({ latitude, longitude, markers = [], height = 200, showPin = true }: MapViewProps) {
  // Lazy require to avoid loading react-native-maps on web
  try {
    const RNMaps = require("react-native-maps");
    const RNMapView = RNMaps.default;
    const Marker = RNMaps.Marker;

    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return (
      <RNMapView
        style={{ width: "100%", height, borderRadius: 16 }}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {showPin && (
          <Marker coordinate={{ latitude, longitude }} title="Location" />
        )}
        {markers.map((m, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            title={m.title || ""}
          />
        ))}
      </RNMapView>
    );
  } catch {
    // Fallback if react-native-maps is not installed
    return (
      <View
        style={{
          width: "100%",
          height,
          borderRadius: 16,
          backgroundColor: "#1E293B",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#94A3B8", fontSize: 14 }}>
          Map (native maps not available)
        </Text>
      </View>
    );
  }
}

export default function MapView(props: MapViewProps) {
  if (Platform.OS === "web") {
    return <WebMap {...props} />;
  }
  return <NativeMap {...props} />;
}
