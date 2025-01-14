# Weather Dashboard Application Documentation

![License](https://img.shields.io/badge/license-MIT-green)
![Vue](https://img.shields.io/badge/vue-3.x-brightgreen)

## Overview

The Weather Dashboard application is a web-based tool designed to provide weather insights in an interactive and visually appealing way. Built using Vue.js, it is in Phase 1 of development and focuses on core functionality without responsive design.

## Key Features

- **Current Weather**: View temperature, humidity, cloud cover, and more.
- **7-Day Forecast**: Stay informed about future weather conditions.
- **Air Quality Monitoring**: Includes AQI, PM2.5, CO2, and other pollutants.
- **Interactive Graphs**: Visualize weather and air quality trends.
- **Modern Design**: Notifications, animations, and navigation with Swiper.

## Current Features (Phase 1)

1. **Weather Data Display**:

   - **Shows current weather conditions and a 7-day forecast.**
   - **Provides air quality information**, including current data and a 3-day forecast.

2. **Weather Metrics**:

   - Temperature (current and feels-like).
   - Cloud cover.
   - UV index.
   - Rain probability.
   - Humidity.
   - Wind speed and wind gusts.

3. **Air Quality Metrics**:

   - **AQI (Air Quality Index, US Standard).**
   - Particulate Matter (PM10 and PM2.5).
   - Carbon Dioxide (CO2).
   - Sulfur Dioxide (SO2).
   - Ozone (O3).

4. **Weather Data Visualization**:

   - Provides graphical representations using Chart.js.

5. **Icons and User Interface**:

   - Utilizes Vue Prime Icons for consistent and modern iconography.
   - Basic styling and layout designed for desktop view.

6. **Notifications**:

   - Implements Pianita for user-friendly and visually appealing notifications.

7. **Swiper Integration**:

   - Allows users to navigate through weather data using Swiper.js.

8. **Tailwind CSS**:

   - Incorporates a utility-first CSS framework for rapid UI development.

9. **Backend Functionality**:

   - The backend fetches hourly weather data from the Open Meteo S3 Open Data repository. Refer to the [Open Meteo Open Data Repository](https://github.com/open-meteo/open-data) for more details.
   - It stores data on a self-hosted server and compares it with the official Open Meteo API for discrepancies.
   - The API server [self host API service repo](https://github.com/thewind121212/weather_api_services)
   - This ensures that the dashboard provides corrected, high-accuracy weather insights.
   - **Note**: The backend server only operates with a complete self-server setup.

10. **Animations**:

   - GSAP and Lottie animations are used to:
     - Smoothly transition between UI elements (e.g., page navigation).
     - Visualize key weather data (e.g., temperature, wind).
     - Add micro-interactions to enhance usability.

11. **Data Querying**:

   - Leverages TanStack Query (useQuery) for efficient and optimized data fetching and caching.

## Technology Stack

- **Frontend Framework**: Vue.js
- **Charting Library**: Chart.js
- **Swiper**: Swiper.js
- **Icons**: Vue Prime Icons
- **Notifications**: Pianita
- **CSS Framework**: Tailwind CSS
- **Animations**: GSAP, Lottie
- **Data Querying**: TanStack Query (useQuery)

## Installation

To set up the application locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/thewind121212/vue-weather.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd vue-weather
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Run the Application**:

   ```bash
   npm run preview
   ```

   **The application will be available at ****`http://localhost:3000/`**** by default.**

## Project Structure

```
vue-weather/
|-- public/               # Static assets
|-- src/
|   |-- chart/            # Chart.js configurations and logic
|   |-- components/       # Vue components
|   |-- data/             # Static or mock data files
|   |-- layout/           # Layout components (e.g., headers, footers)
|   |-- lib/              # Utility libraries and helper functions
|   |-- moon/             # Specialized components or features related to moon/weather visuals
|   |-- store/            # State management files (e.g., Vuex, Pinia)
|   |-- types/            # TypeScript type definitions
|   |-- utils/            # General utility functions
|   |-- vendor/Lottie/    # Lottie animations and related assets
|   |-- main.ts           # Application entry point
|   |-- style.css         # Global styles
|   |-- vite-env.d.ts     # Vite environment types
|-- package.json          # Project metadata and dependencies
|-- README.md             # Project README file
```

## Limitations in Phase 1

- **No Responsive Design**:

  - The current layout is optimized for desktop screens only.

- **Limited Features**:

  - Basic weather data display without advanced interactivity.

- **Static Data**:

  - Relies on predefined API and server setup for data retrieval.

## Future Enhancements (Planned for Phase 2 and Beyond)

1. **Responsive Design**:

   - Optimize the application for mobile and tablet screens.

2. **Advanced Weather Features**:

   - Add additional weather metrics and interactive controls.

3. **Customization**:

   - Enable users to personalize the dashboard layout and features.

4. **Performance Optimization**:

   - Improve loading times and optimize resource usage.

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

For inquiries or contributions, reach out via the [GitHub Repository](https://github.com/thewind121212/vue-weather).

