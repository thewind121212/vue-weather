<script setup lang="ts">

import { AxiosCLient } from '../../lib/axios';
import { useModalStore } from '../../store/modal';
import { useQuery } from '@tanstack/vue-query';
import { ModalName } from '../../types/appTypes';
import { useLocationStore } from '../../store/location';
import { Location } from '../../types/geoTypes';
import { MoonResponse } from '../../types/moon';
import { AxiosResponse } from 'axios';
import { computed, watch } from 'vue';
import { useMoonStore } from '../../store/moon';
import { genMoonPhaseImage } from '../../utils/utils';

const modalStore = useModalStore()
const locationStore = useLocationStore()
const moonStore = useMoonStore()

const props = defineProps<{
    startTimeLine: (arg: ModalName) => void;
    day: string;
}>()



const fetchMoonPhaseFn = async (): Promise<MoonResponse | null> => {
    try {
        const locationLocalStore = localStorage.getItem('location')

        let locationParams: Location | null = locationStore.location
        locationParams = locationParams ? locationParams : locationLocalStore ? JSON.parse(locationLocalStore) : null

        if (!locationParams) {
            throw new Error('Location not found')
        }

        const moonPhase: AxiosResponse<MoonResponse> = await AxiosCLient.get('/moon-phase', {
            params: {
                manualTimezone: locationParams.timezone ? locationParams.timezone : 'Asia/Ho_Chi_Minh',
                locationIdRequest: locationParams.id,
                latitudeRequest: locationParams.latitude,
                longitudeRequest: locationParams.longitude
            }
        })

        if (!moonPhase.data) {
            throw new Error('Moon Phase not found')
        }

        moonStore.setMoonState(moonPhase.data.data)

        return moonPhase.data


    } catch (error) {
        console.error(error)
        return null

    }


}


const { data, refetch, isLoading } = useQuery({
    queryKey: ['moonPhase'],
    queryFn: fetchMoonPhaseFn,
})


watch(locationStore.$state, () => {
    refetch()
})



const date = computed(() => {
    if (props.day) {
        return new Date(props.day).getDate()
    }
    return 0
})

const moonPhase = computed<
    {
        fullMoon: string,
        newMoon: string
    }

>(() => {
    let fullMoon = 'Full Moon In 0 Day'
    let newMoon = 'New Moon In 0 Day'
    if (data && date.value) {
        const findIndex = data.value?.data.findIndex((item) => item.moonPhase === 'Full Moon')! + 1
        if (!findIndex) {
            fullMoon = "This Month Don't Have Full Moon"
        }
        if (findIndex && findIndex - date.value > 0) {
            fullMoon = `Full Moon In ${(findIndex - date.value)} Day`
        }
        if (findIndex && findIndex - date.value === 0) {
            fullMoon = `Full Moon Today`
        }
        if (findIndex && findIndex - date.value < 0) {
            fullMoon = `Full Moon Past ${(Math.abs(findIndex - date.value))} Day`
        }

        const findIndexNewMoon = (data.value?.data.findIndex((item) => item.moonPhase === 'New Moon'))! + 1
        if (!findIndexNewMoon) {
            newMoon = "This Month Don't Have New Moon"
        }

        if (findIndexNewMoon && findIndexNewMoon - date.value > 0) {
            newMoon = `New Moon In ${(findIndexNewMoon - date.value)} Day`
        }

        if (findIndexNewMoon && findIndexNewMoon - date.value < 0) {
            newMoon = `New Moon Past ${(Math.abs(findIndexNewMoon - date.value))} Day`
        }


        return {
            fullMoon,
            newMoon
        }
    }

    return {
        fullMoon: 'Full Moon In 0 Day',
        newMoon: 'New Moon In 0 Day'
    }
})

</script>



<template>
    <div
        class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative bg-[url('/image.webp')] bg-cover bg-center overflow-hidden">
        <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0 pointer-events-none"
            :class="{ '!pointer-events-auto': modalStore.modalMounted === 'moon' }" v-on:click="startTimeLine('moon')"
            id="moon-placeholder">
        </div>

        <div v-if="isLoading"
            class="w-full h-full bg-[#0d132180] flex gap-2 px-4 backdrop-blur-[1px] cursor-default select-none justify-center items-center">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
            </svg>

        </div>


        <div v-if="!isLoading"
            class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 px-4 backdrop-blur-[1px] cursor-default select-none">
            <div class="flex justify-center items-start flex-col">

                <div class="w-full h-[1.3125rem]">
                    <div class="font-light text-white text-[0.875rem] block">{{ data?.data[date - 1].moonPhase }}</div>
                </div>
                <div class="w-full h-[1.3125rem]">
                    <div class="font-light text-white text-[0.875rem] block">{{ moonPhase.fullMoon }}</div>
                </div>
                <div class="w-full h-[1.3125rem]">
                    <div class="font-light text-white text-[0.875rem] block"> {{ moonPhase.newMoon }}</div>
                </div>
                <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer pointer-events-none"
                    v-on:click="startTimeLine('moon')" :class="{ '!pointer-events-auto': !modalStore.modalMounted }">
                    See More</p>
            </div>
            <div class="relative flex justify-center items-center ml-2">
                <img class="size-[4.5rem] absolute" :src="genMoonPhaseImage(data?.data[date - 1].moonPhase ?? 'New Moon')" alt="waxing-gibbous" />
            </div>
        </div>
    </div>

</template>