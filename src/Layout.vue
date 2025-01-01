<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { type WeatherData } from './types/weatherTypes';
import CurrentWeatherReport from './components/CurrentWeatherReport.vue';
import { AxiosCLient } from './lib/axios';
import axios from 'axios';




const currentWeatherFetch = async (): Promise<WeatherData | null> => {

  try {

    const res = await AxiosCLient.get('/weather', {
      params: {
        locationName: "Ho Chi Minh",
        manualTimezone: 'Asia/Ho_Chi_Minh',
        quickRetriveId: 1566083,
      }
    })


    return res.data
  } catch (error) {
    console.log('Error', error)
    console.error(error);
    return null
  }
}

const { isPending, isError, data, isFetching } = useQuery({
  queryKey: ['currentWeather'],
  queryFn: currentWeatherFetch,
})

console.log(data.value)


</script>

<template>
  <div class="w-svw h-svh padding-main bg-[#1A182C] dark font-sfPro font-[500]">
    <div className="flex h-full w-full items-center justify-center">
      <div className="grid h-full w-full gap-8 p-2 grid-cols-4 grid-rows-2 rounded-lg">

        <CurrentWeatherReport :data="data?.current" :isPending="isPending" :isError="isError"
          :isFetching="isFetching" />
        <div className="col-span-1 row-span-1 bg-[#222239] rounded-2xl flex items-center justify-center">
          2
        </div>

        <div className="col-span-1 row-span-2 bg-[#222239] rounded-2xl flex items-center justify-center">
          3
        </div>

        <div className="col-span-3 row-span-1 bg-[#222239] rounded-2xl flex items-center justify-center">
          4
        </div>

      </div>
    </div>

  </div>
</template>
