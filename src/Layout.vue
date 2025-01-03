<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { type WeatherDataRes } from './types/weatherTypes';
import CurrentWeatherReport from './components/CurrentWeatherReport.vue';
import { AxiosCLient } from './lib/axios';
import { reactive, ref } from 'vue';
import { useTempUnitStore } from './store/tempUnit';



const time = reactive<{
  day: string,
  hr: string
}>({
  day: "",
  hr: ""
})

const inputRef = ref<HTMLInputElement | null>(null)
const unit = useTempUnitStore()

const currentWeatherFetch = async (): Promise<WeatherDataRes | null> => {



  try {

    const res = await AxiosCLient.get('/weather', {
      params: {
        locationName: "DaLat",
        manualTimezone: 'Asia/Ho_Chi_Minh',
      }
    })

    const timeBaseOnTimeZone = new Date().toLocaleString("en-US", {
      timeZone: res.data.timezone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    });

    time.hr = timeBaseOnTimeZone.split(',')[3]
    time.day = timeBaseOnTimeZone.split(',').slice(0, 3).join(',')



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


const onChanges = () => {
  //handler fnction later
  // console.log(inputRef.value)
}


</script>

<template>
  <div class="w-svw h-svh padding-main bg-primary dark font-sfPro font-[500]">
    <div class="top-bar p-2 flex justify-start items-center">
      <img src="/logo.webp" alt="logo"
        class="w-[80px] h-[80px] scale-125 min-w-[80px] min-h-[80px] -translate-y-[0.5px]" />
      <div class="w-auto h-[64px] flex justify-center items-star flex-col">
        <div class="w-auto h-auto flex justify-start items-center text-[#dae2eb]">
          <p class="text-2xl">
            {{ time.hr }}
          </p>
          <i v-if="Number(time.hr.trim().substring(0, 2)) > 18" class="pi pi-moon ml-1 animate-spin-slow"
            style="font-size: 1.3rem"></i>
          <i v-else class="pi pi-sun ml-1 animate-spin-slow" style="font-size: 1.5rem"></i>
        </div>
        <p class="text-white text-4xl">
          {{ time.day }}
        </p>
      </div>
      <div class="w-[400px] h-[64px] ml-auto flex justify-start items-center gap-6">
        <!-- location find  -->
        <div class="w-[300px] h-[51px] relative flex">
          <i class="pi pi-map ml-4 text-white absolute left-0 top-1/2 -translate-y-1/2" style="font-size: 1.5rem;"></i>
          <input type="text"
            class="w-full h-full bg-secondary rounded-xl text-[#dae2eb] pl-[48px] outline-none border-transparent"
            v-on:input="onChanges" v-model="inputRef" placeholder="Search city" />
        </div>
        <div class="bg-secondary w-[110px] h-[51px] rounded-[27px] flex justify-center items-center relative"
          v-on:click="unit.setTempUnit(unit.$state.tempUnit === 'C' ? 'F' : 'C')">
          <div
            class="w-[42px] h-[42px] aspect-square rounded-[21px] text-black flex justify-center items-center duration-300 bg-[#7068FF] absolute z-10"
            :class="unit.$state.tempUnit === 'C' ? '!left-[8px]' : 'left-[50%]'">
          </div>
          <div
            class="w-[42px] h-[42px] aspect-square bg-transparent font-semibold rounded-[21px] flex justify-center items-center translate-x-[2px] translate-y-[1px] relative z-20 cursor-pointer"
            :class="unit.$state.tempUnit === 'C' ? 'text-white' : 'text-[#676B73]'">
            C°
          </div>
          <div
            class="w-[42px] h-[42px] aspect-square bg-transparent font-semibold rounded-[21px] flex justify-center items-center translate-x-[2px] translate-y-[1px] relative z-20 cursor-pointer"
            :class="unit.$state.tempUnit === 'F' ? 'text-white' : 'text-[#676B73]'">
            F°
          </div>
        </div>
      </div>
    </div>
    <div class="flex h-[calc(100vh-160px)] w-full items-center justify-center">
      <div class="grid h-full w-full gap-8 p-2 grid-cols-4 grid-rows-3 rounded-lg">
        <CurrentWeatherReport :data="data?.data.current" :isPending="isPending" :isError="isError"
          :currentDay="data?.data.daily" :timeZone="data?.data.timezone" :isFetching="isFetching" />
        <div class="col-span-2 row-span-2 bg-secondary rounded-2xl flex items-center justify-center">
          2
        </div>
        <div class="col-span-3 row-span-1 bg-secondary rounded-2xl flex items-center justify-center">
          4
        </div>
        <div class="col-span-1 row-span-1 bg-secondary rounded-2xl flex items-center justify-center">
          4
        </div>

      </div>
    </div>

  </div>
</template>
