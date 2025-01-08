enum Unit {
    Iso8601 = "iso8601",
    Seconds = "seconds",
    USAQI = "USAQI",
    MicrogramPerCubicMeter = "μg/m³",
}

interface CurrentUnits {
    time: Unit;
    interval: Unit;
    us_aqi: Unit;
    pm2_5: Unit;
    pm10: Unit;
    carbon_monoxide: Unit;
    sulphur_dioxide: Unit;
    ozone: Unit;
}

interface CurrentAirData {
    time: string;
    interval: number;
    us_aqi: number;
    uv_index: number;
    pm2_5: number;
    pm10: number;
    carbon_dioxide: number,
    sulphur_dioxide: number,
    ozone: number,
    carbon_monoxide: number;
}

interface HourlyAirUnits {
    time: Unit;
    pm2_5: Unit;
    carbon_monoxide: Unit;
    uv_index: Unit;
    us_aqi: Unit;
}

interface HourlyAirData {
    time: string[];
    pm2_5: (number)[];
    carbon_monoxide: (number)[];
    uv_index: (number)[];
    us_aqi: (number)[];
}

interface AirQualityData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: CurrentUnits;
    current: CurrentAirData;
    hourly_units: HourlyAirUnits;
    hourly: HourlyAirData;
    daily_units: any;
    daily: any;
    locaitonId: string;
    timestamp: number;
}


interface AirQualityRes {

    current: string;
    data: AirQualityData;
    message: string;
}


type FaceType = "good" | "moderate" | "semi unhealthy" | "unhealthy" | "very unhealthy" | "haizous" | "unknow"

export type { AirQualityData, CurrentAirData, HourlyAirData, CurrentUnits, HourlyAirUnits, Unit, AirQualityRes, FaceType }
