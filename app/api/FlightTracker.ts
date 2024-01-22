/* eslint-disable camelcase */
export interface FlightDataRequest {
  api_key: string
  zoom: number
  flight_icao: string
  flight_iata: string
  flight_number: string
}

export interface FlightDataResponse {
  hex: string
  reg_number: string
  lat: number
  lng: number
  alt: number
  dir: number
  speed: number
  v_speed: -7.8
  flight_number: number
  flight_icao: string
  flight_iata: string
  dep_icao: string
  airline_icao: string
  airline_iata: string
  aircraft_icao: string
  status: string
}

export class FlightTrackerApi {
  constructor() {
    this.url = "https://airlabs.co/api/v9/"
  }

  private url: string

  async getFlights({
    api_key,
    zoom,
    flight_iata,
    flight_icao,
    flight_number,
  }: Partial<FlightDataRequest> = {}) {
    if (!api_key) {
      return
    }
    let queryParams = `api_key=${api_key}`
    if (zoom) {
      queryParams = `${queryParams}&zoom=${zoom}`
    }
    if (flight_iata) {
      queryParams = `${queryParams}&flight_iata=${flight_iata}`
    }
    if (flight_icao) {
      queryParams = `${queryParams}&flight_icao=${flight_icao}`
    }
    if (flight_number) {
      queryParams = `${queryParams}&flight_number=${flight_number}`
    }

    const flightCall = await fetch(`${this.url}flights${queryParams}`)

    return (await flightCall.json()) as {
      data?: FlightDataResponse[]
      errors?: Array<{ message: string }>
    }
  }
}
