export interface Resort {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  country: string;
  region: string;
}

export interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface ApiResponse {
  current_weather: WeatherData;
  elevation: number;
  timezone: string;
}

export interface ResortWeather {
  resort: Resort;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export interface WeatherDescription {
  text: string;
  icon: string;
  isSnowyCondition: boolean;
}
