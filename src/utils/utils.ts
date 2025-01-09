import { FaceType } from "../types/airTypes"


export const timeImgGen = (t: number) => {
  if (t >= 0 && t < 3) {
    return '/weather_icons/time-night.svg'
  }
  if (t > 2 && t < 6) {
    return '/weather_icons/time-late-night.svg'
  }
  if (t > 5 && t < 9) {
    return '/weather_icons/time-morning.svg'
  }
  if (t > 8 && t < 12) {
    return "/weather_icons/time-late-morning.svg"
  }
  if (t > 11 && t < 15) {
    return "/weather_icons/time-afternoon.svg"
  }
  if (t > 14 && t < 18) {
    return "/weather_icons/time-late-afternoon.svg"
  }
  if (t > 17 && t < 21) {
    return "/weather_icons/time-evening.svg"
  }
  return "/weather_icons/time-late-evening.svg"
}


const GREEN = "#9CD84E"
const GREEN_OP = "#9CD84E80"
const YELLOW = "#FACF38"
const YELLOW_OP = "#FACF3880"
const ORANGE = "#F89049"
const ORANGE_OP = "#F8904980"
const RED = "#F65E5F"
const RED_OP = "#F65E5F80"
const PURPLE = "#F65E5F"
const PURPLE_OP = "#F65E5F80"
const MAROON = "#A06A7B"
const MAROON_OP = "#A06A7B80"


export const genTheAirImage = (AQI: number): {
  color: string | null
  type: FaceType
  imgSource: string | null
} => {
  if (AQI > 0 && AQI < 51) {
    return {
      color: GREEN,
      type: "good",
      imgSource: "/air_quality_icons/ic_face_48_green.svg"
    }
  }
  if (AQI > 50 && AQI < 101) {
    return {
      color: YELLOW,
      type: "moderate",
      imgSource: "/air_quality_icons/ic_face_48_yellow.svg"
    }
  }
  if (AQI > 100 && AQI < 151) {
    return {
      color: ORANGE,
      type: "semi unhealthy",
      imgSource: "/air_quality_icons/ic_face_48_orange.svg"
    }
  }
  if (AQI > 150 && AQI < 201) {
    return {
      color: RED,
      type: "unhealthy",
      imgSource: "/air_quality_icons/ic_face_48_red.svg"
    }
  }
  if (AQI > 200 && AQI < 301) {
    return {
      color: PURPLE,
      type: "very unhealthy",
      imgSource: "/air_quality_icons/ic_face_48_purple.svg"
    }
  }
  if (AQI > 300) {
    return {
      color: MAROON,
      type: "haizous",
      imgSource: "/air_quality_icons/ic_face_48_maroon.svg"
    }
  }


  return {
    color: null,
    type: "unknow",
    imgSource: null
  }


}

export function getPM10Level(pm10Value: number) {
  if (pm10Value <= 15) {
    return {
      color: GREEN,
      colorOP: GREEN_OP,
      decision: "Air quality is excellent. No health implications."
    };
  } else if (pm10Value <= 45) {
    return {
      color: YELLOW,
      colorOP: YELLOW_OP,
      decision: "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor activity."
    };
  } else if (pm10Value <= 75) {
    return {
      color: ORANGE,
      colorOP: ORANGE_OP,
      decision: "Members of sensitive groups may experience minor health effects. Others are less likely to be affected."
    };
  } else if (pm10Value <= 125) {
    return {
      color: RED,
      colorOP: RED_OP,
      decision: "Everyone may begin to experience health effects; sensitive groups may be more affected."
    };
  } else if (pm10Value <= 150) {
    return {
      color: PURPLE,
      colorOP: PURPLE_OP,
      decision: "Health alert: Everyone may experience significant health effects."
    };
  } else {
    return {
      color: MAROON,
      colorOP: MAROON_OP,
      decision: "Emergency conditions. The entire population is likely to experience adverse health effects."
    };
  }
}


export function getCO2Level(coValue: number) {
  if (coValue <= 1830) {
    return {
      color: GREEN,
      colorOP: GREEN_OP,
      decision: "Air quality is excellent. No health implications."
    };
  } else if (coValue <= 3660) {
    return {
      color: YELLOW,
      colorOP: YELLOW_OP,
      decision: "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor activity."
    };
  } else if (coValue <= 5000) {
    return {
      color: ORANGE,
      colorOP: ORANGE_OP,
      decision: "Members of sensitive groups may experience minor health effects. Others are less likely to be affected."
    };
  } else if (coValue <= 7000) {
    return {
      color: RED,
      colorOP: RED_OP,
      decision: "Everyone may begin to experience health effects; sensitive groups may be more affected."
    };
  } else if (coValue <= 8000) {
    return {
      color: PURPLE,
      colorOP: PURPLE_OP,
      decision: "Health alert: Everyone may experience significant health effects."
    };
  } else {
    return {
      color: MAROON,
      colorOP: MAROON_OP,
      decision: "Emergency conditions. The entire population is likely to experience adverse health effects."
    };
  }
}

export function getO3Level(o3Value: number) {
  if (o3Value <= 100) {
    return {
      color: GREEN,
      colorOP: GREEN_OP,
      decision: "Air quality is excellent. No health implications."
    };
  } else if (o3Value <= 160) {
    return {
      color: YELLOW,
      colorOP: YELLOW_OP,
      decision: "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor activity."
    };
  } else if (o3Value <= 200) {
    return {
      color: ORANGE,
      colorOP: ORANGE_OP,
      decision: "Members of sensitive groups may experience minor health effects. Others are less likely to be affected."
    };
  } else if (o3Value <= 240) {
    return {
      color: RED,
      colorOP: RED_OP,
      decision: "Everyone may begin to experience health effects; sensitive groups may be more affected."
    };
  } else if (o3Value <= 300) {
    return {
      color: PURPLE,
      colorOP: PURPLE_OP,
      decision: "Health alert: Everyone may experience significant health effects."
    };
  } else {
    return {
      color: MAROON,
      colorOP: MAROON_OP,
      decision: "Emergency conditions. The entire population is likely to experience adverse health effects."
    };
  }
}

export function getSO2Level(so2Value: number) {
  if (so2Value <= 50) {
    return {
      color: GREEN,
      colorOP: GREEN_OP,
      decision: "Air quality is excellent. No health implications."
    };
  } else if (so2Value <= 100) {
    return {
      color: YELLOW,
      colorOP: YELLOW_OP,
      decision: "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor activity."
    };
  } else if (so2Value <= 200) {
    return {
      color: ORANGE,
      colorOP: ORANGE_OP,
      decision: "Members of sensitive groups may experience minor health effects. Others are less likely to be affected."
    };
  } else if (so2Value <= 300) {
    return {
      color: RED,
      colorOP: RED_OP,
      decision: "Everyone may begin to experience health effects; sensitive groups may be more affected."
    };
  } else if (so2Value <= 350) {
    return {
      color: PURPLE,
      colorOP: PURPLE_OP,
      decision: "Health alert: Everyone may experience significant health effects."
    };
  } else {
    return {
      color: MAROON,
      colorOP: MAROON_OP,
      decision: "Emergency conditions. The entire population is likely to experience adverse health effects."
    };
  }
}


export const getAirlive = (pm10: number, co2: number, so2: number, o3: number) => [
  {
    name: "PM10",
    unit: "μg/m³",
    value: pm10,
    color: getPM10Level(pm10).color,
    colorbg: getPM10Level(pm10).colorOP,
    max: 150
  },
  {
    name: "CO2",
    unit: "μg/m³",
    value: co2,
    color: getCO2Level(co2).color,
    colorbg: getCO2Level(co2).colorOP,
    max: 6000
  },
  {
    name: "SO2",
    unit: "μg/m³",
    value: so2,
    color: getSO2Level(so2).color,
    colorbg: getSO2Level(so2).colorOP,
    max: 350
  },
  {
    name: "O3",
    unit: "μg/m³",
    value: o3,
    color: getO3Level(o3).color,
    colorbg: getO3Level(o3).colorOP,
    max: 300
  }
]



export const genTimeFn = (time: number) => {
  if (time < 9) {
    return `${time} AM`
  }
  if (time < 13) {
    return `${time} AM`
  }

  if (time < 24) {
    return `${time - 12} PM`
  }

}

export function getUVIndexRiskText(uvIndex: number): {
  advice: string,
  color: string
} {
  if (uvIndex >= 0 && uvIndex <= 3) {
    return {
      advice: "0-2 Minimal risk. You can safely enjoy outdoor activities. Wear sunglasses on bright days.",
      color: "#4ade80"
    }
  } else if (uvIndex <= 5) {
    return {
      advice: "3-5 Moderate risk. Use sunscreen (SPF 30+), wear a hat and sunglasses, and seek shade during midday.",
      color: "#fde047"
    }
  } else if (uvIndex <= 7) {
    return {
      advice: "6-7 High risk. Apply sunscreen generously, wear protective clothing, and avoid staying in direct sunlight",
      color: "#fb923c"
    }
  } else if (uvIndex <= 10) {
    return {
      advice: "8-10 Very high risk. Minimize sun exposure, stay in the shade, and use a broad-spectrum sunscreen with SPF 30+.",
      color: "#f87171"
    }
  } else if (uvIndex >= 11) {
    return {
      advice: "11+ Extreme risk. Avoid outdoor activities if possible, especially during midday. Use sunscreen, cover up completely, and stay indoors.",
      color: '#a78bfa'
    }
  } else {
    return {
      advice: "Invalid UV index. Please provide a number between 0 and 11+.",
      color: '#f87171'
    }
  }
}


export function getRainAdvice(percent: number) {
  if (percent >= 0 && percent <= 20) {
    return {
      advice: "Minimal chance of rain. You can plan outdoor activities with confidence. No need for rain gear.",
      color: "#4ade80"
    };
  } else if (percent > 20 && percent <= 40) {
    return {
      advice: "Slight chance of rain. Consider carrying a small umbrella or a raincoat, just in case.",
      color: "#fef08a"
    };
  } else if (percent > 40 && percent <= 60) {
    return {
      advice: "Moderate chance of rain. Check the forecast for timing. Bring an umbrella for outdoor plans.",
      color: "#fb923c"
    };
  } else if (percent > 60 && percent <= 80) {
    return {
      advice: "Rain is likely. Plan for wet conditions. Wear waterproof shoes and carry an umbrella or raincoat.",
      color: "#f87171"
    };
  } else if (percent > 80 && percent <= 100) {
    return {
      advice: "Rain is very likely or guaranteed. Limit outdoor activities if possible and prepare for wet conditions.",
      color: '#a78bfa'
    };
  } else {
    return {
      advice: "Invalid percentage. Please provide a value between 0 and 100.",
      color: "#000000"
    };
  }
}

export function getHumidityAdvice(humidity: number) {
  if (humidity >= 0 && humidity <= 30) {
    return {
      advice: "Low humidity. The air is dry, which may cause discomfort for some people. Stay hydrated and use moisturizer if necessary.",
      color: "#eff6ff"
    };
  } else if (humidity > 30 && humidity <= 60) {
    return {
      advice: "Comfortable humidity. Ideal for most activities also feel very comfort.",
      color: "#bfdbfe"
    };
  } else if (humidity > 60 && humidity <= 84) {
    return {
      advice: "High humidity. May feel sticky or uncomfortable. Try to reduce humidity for more comfort.",
      color: "#3b82f6"
    };
  } else if (humidity > 84 && humidity <= 100) {
    return {
      advice: "Very high humidity. The air feels heavy and may pose health risks, especially for those with respiratory conditions.",
      color: "#2563eb"
    };
  } else {
    return {
      advice: "Invalid humidity. Please provide a value between 0 and 100.",
      color: "#000000"
    };
  }
}