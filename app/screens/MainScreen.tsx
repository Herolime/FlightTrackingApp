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
import { FlightDataRequest, FlightDataResponse, FlightTrackerApi } from "app/api/FlightTracker"

export const MainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationObjectCoords | undefined>(
    undefined,
  )
  const [initialRegion, setInitialRegion] = useState<
    | { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }
    | undefined
  >(undefined)

  const [searchValue, setSearchValue] = useState("")
  const [flights, setFlights] = useState<FlightDataResponse[]>([])

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

  const getFlights = async (req: Partial<FlightDataRequest>) => {
    const trackerApi = new FlightTrackerApi()
    const result = await trackerApi.getFlights(req)
    if (result !== undefined) {
      const { data, errors } = result
      if (errors && errors.length > 0) {
        for (const error of errors) {
          console.error(error)
        }
      }
      if (data) {
        setFlights(data)
      }
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (searchValue && searchValue.length >= 2) {
      const searchRequest: Partial<FlightDataRequest> = {}
      if (searchValue.length === 2) {
        searchRequest.flight_icao = searchValue
      }
      if (searchValue.length === 3) {
        searchRequest.flight_iata = searchValue
      }
      if (searchValue.length > 3) {
        if (searchValue.length === 6) {
          const checkNumber = searchValue.substring(2)
          if (!isNaN(Number(checkNumber))) {
            searchRequest.flight_number = searchValue
          }
        }
      }
      getFlights(searchRequest)
    }
  }, [searchValue])

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
        <TextField
          placeholder="Search for Flight..."
          value={searchValue}
          onChangeText={(e) => setSearchValue(e)}
        />
      </View>
      <View style={$list}>
        <SearchResults flights={flights} />
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
const $list: ViewStyle = {
  width: "100%",
  height: "50%",
}

const $searchContainer: ViewStyle = {
  paddingVertical: spacing.xs,
}
