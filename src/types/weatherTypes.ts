
enum Unit {
  ISO8601 = "iso8601",
  Seconds = "seconds",
  Celsius = "°C",
  Percent = "%",
  Millimeters = "mm",
  WMOCode = "wmo code",
  KilometersPerHour = "km/h",
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
  rain: Unit.Millimeters;
  weather_code: Unit.WMOCode;
  cloud_cover: Unit.Percent;
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
}

interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
}



interface WeatherHourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  weather_code: string[];
  cloud_cover: number[];
}


interface WeatherDailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
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


export { Unit };
export type { WeatherDataRes, WeatherData, CurrentWeatherData, WeatherHourlyData, WeatherDailyData, CurrentWeatherUnits, HourWeatherUnits, DailyWeatherUnits };
