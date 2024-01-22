import { FlightDataResponse } from "app/api/FlightTracker"
import React, { FC } from "react"
import { ListView } from "./ListView"
import { ContentStyle } from "@shopify/flash-list"
import { spacing } from "app/theme"
import { FlightCard } from "./FlightCard"

export interface SearchResultsProps {
  flights: FlightDataResponse[]
}

export const SearchResults: FC<SearchResultsProps> = (props) => {
  return (
    <>
      <ListView<FlightDataResponse>
        contentContainerStyle={$listContentContainer}
        data={props.flights.slice()}
        renderItem={(d) => <FlightCard flight={d.item} />}
      />
    </>
  )
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}
