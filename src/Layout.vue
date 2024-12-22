<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { WeatherData } from './types/weatherTypes';
import CurrentWeatherReport from './components/CurrentWeatherReport.vue';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;


const currentWeatherFetch = async (): Promise<WeatherData | null> => {

  try {

    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Ho_Chi_Minh&aqi=yes`);
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error);
    return null
  }
}

const { isPending, isError, data, isFetching } = useQuery({
  queryKey: ['currentWeather'],
  queryFn: currentWeatherFetch,
})

console.log(data.value?.current.air_quality);

</script>

<template>
  <div class="w-svw h-svh padding-main bg-[#000000] dark font-sfPro font-[500]">
    <div className="flex h-full w-full items-center justify-center">
      <div className="grid h-full w-full gap-8 p-2 grid-cols-4 grid-rows-2 rounded-lg">

        <CurrentWeatherReport :data="data?.current" :isPending="isPending" :isError="isError" :isFetching="isFetching" />
        <div className="col-span-1 row-span-1 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
          2
        </div>

        <div className="col-span-1 row-span-2 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
          3
        </div>

        <div className="col-span-3 row-span-1 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
          4
        </div>

      </div>
    </div>

  </div>
</template>
