import { FlightDataResponse } from "app/api/FlightTracker"
import React, { FC } from "react"
import { Card } from "./Card"
import { spacing } from "app/theme"
import { ViewStyle } from "react-native"

export interface FlightCardProps {
  flight: FlightDataResponse
}

export const FlightCard: FC<FlightCardProps> = ({ flight }) => {
  return (
    <Card style={$item}>
      {`${flight.airline_iata} - ${flight.airline_icao} - ${flight.flight_number}`}
    </Card>
  )
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}
