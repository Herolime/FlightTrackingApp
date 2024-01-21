import { Screen, TextField } from "app/components"
import { View, ViewStyle } from "react-native"
import MapView, { Marker } from "react-native-maps"
import React, { useEffect, useState } from "react"
import { SearchResults } from "app/components/SearchResults"
import { spacing } from "app/theme"
import {
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location"

export const MainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationObjectCoords | undefined>(
    undefined,
  )
  const [initialRegion, setInitialRegion] = useState<
    | { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }
    | undefined
  >(undefined)

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.log("Permission to access location was denied")
        return
      }

      const location = await getCurrentPositionAsync({})
      setCurrentLocation(location.coords)

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })
    }

    getLocation()
  }, [])
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <MapView style={$map} initialRegion={initialRegion}>
        {currentLocation && <Marker title="Your Location" coordinate={currentLocation} />}
      </MapView>
      <View style={$searchContainer}>
        <TextField placeholder="Search for Flight..." />
      </View>
      <View>
        <SearchResults />
      </View>
    </Screen>
  )
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  flex: 1,
}

const $map: ViewStyle = {
  width: "100%",
  height: "40%",
}

const $searchContainer: ViewStyle = {
  paddingVertical: spacing.xs,
}
