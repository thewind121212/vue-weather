
enum Unit {
  ISO8601 = "iso8601",
  Seconds = "seconds",
  Celsius = "°C",
  Percent = "%",
  Millimeters = "mm",
  WMOCode = "wmo code",
  KilometersPerHour = "km/h",
  hPa = "hPa",
  Centimeters = "cm",
  Degree = "°",
  Hour = "h",
  None = "",
}

interface CurrentWeatherUnits {
  time: Unit.ISO8601;
  interval: Unit.Seconds;
  temperature_2m: Unit.Celsius;
  relative_humidity_2m: Unit.Percent;
  apparent_temperature: Unit.Celsius;
  precipitation: Unit.Millimeters;
  rain: Unit.Millimeters;
  weather_code: Unit.WMOCode;
  cloud_cover: Unit.Percent;
  wind_speed_10m: Unit.KilometersPerHour;
}



interface HourWeatherUnits {
  time: Unit.ISO8601;
  temperature_2m: Unit.Celsius;
  relative_humidity_2m: Unit.Percent;
  apparent_temperature: Unit.Celsius;
  precipitation_probability: Unit.Percent;
  precipitation: Unit.Millimeters;
  snowfall: Unit.Centimeters;
  rain: Unit.Millimeters;
  weather_code: Unit.WMOCode;
  cloud_cover: Unit.Percent;
  showers: Unit.Millimeters;
}

interface DailyWeatherUnits {
  time: Unit.ISO8601;
  weather_code: Unit.WMOCode;
  temperature_2m_max: Unit.Celsius;
  temperature_2m_min: Unit.Celsius;
  apparent_temperature_max: Unit.Celsius;
  apparent_temperature_min: Unit.Celsius;
  sunrise: Unit.ISO8601;
  uv_index_max: Unit.None;
  precipitation_sum: Unit.Millimeters;
  rain_sum: Unit.Millimeters;
  precipitation_hours: Unit.Hour;
  precipitation_probability_max: Unit.Percent;
  wind_speed_10m: Unit.KilometersPerHour
  wind_direction_10m: Unit.Degree,
  wind_gusts_10m: Unit.KilometersPerHour
  showers_sum: Unit.Millimeters;
  snowfall_sum: Unit.Centimeters;
}

interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  surface_pressure: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10: number,
  wind_gusts_10m: number
}



interface WeatherHourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  snowfall: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  wind_gusts_10m: number[];
  cloud_cover: number[];
  showers: number[];
}


interface WeatherDailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
}

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentWeatherUnits;
  current: CurrentWeatherData;
  hourly_units: HourWeatherUnits;
  hourly: WeatherHourlyData;
  daily_units: DailyWeatherUnits;
  daily: WeatherDailyData;
  locationId: string;
  timestamp: number;

}


interface WeatherDataRes {
  current: string;
  data: WeatherData;
  message: string;
}



interface WeatherCodeType {
  category: string,
  description: string,
  image_day: string,
  image_night: string,
}

export { Unit };
export type { WeatherCodeType, WeatherDataRes, WeatherData, CurrentWeatherData, WeatherHourlyData, WeatherDailyData, CurrentWeatherUnits, HourWeatherUnits, DailyWeatherUnits };
