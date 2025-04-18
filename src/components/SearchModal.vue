<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { debounce } from "lodash";
import { useQuery } from '@tanstack/vue-query';
import { AxiosCLient } from '../lib/axios';
import { GeoResponse, Location } from '../types/geoTypes';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import gsap from 'gsap'
import { useLocationStore } from '../store/location';


const inputValue = ref<string | null>(null)
const loading = ref<boolean>(false)
const showModel = ref<boolean>(false)
const inputRef = ref<HTMLElement | null>(null)
const locationStore = useLocationStore()

const inputOverlay = ref<HTMLElement | null>(null)
const inputSeach = ref<HTMLElement | null>(null)


var seachTl = gsap.timeline({
    paused: true, onComplete: () => {
        if (inputRef.value) {
            inputRef.value.focus()
        }
    }
});



onMounted(() => {
    inputRef.value = document.getElementById("searchInputField")
    seachTl.fromTo(inputOverlay.value, {
        display: "none",
    }, {
        display: "block",
    }, '>')
        .fromTo(inputSeach.value, {
            opacity: 0,
            animation: "power1.out",
            duration: 0.5,
            y: -50
        }, {
            opacity: 1,
            y: 0,
            animation: "power1.out",
            duration: 0.5
        }, '<')
})


const geoQueryFetch = async () => {
    try {
        const geoQuery: { data: { data: GeoResponse } } = await AxiosCLient.post("/geo_search", {
            geoQuery: inputValue.value?.trimEnd()
        })
        loading.value = false
        return geoQuery.data.data
    } catch (error) {
        console.log('Error', error)
        console.error(error);
        return null
    }
}


const onChanges = () => {
    if (!inputValue.value) {
        return
    }
    refetch()
}

watch(inputValue, () => {
    loading.value = true
})


watch(showModel, () => {
    const appElement = document.getElementById("app");
    if (showModel.value) {
        if (appElement) {
            appElement.style.overflow = "hidden";
        }
    } else {
        document.getElementById("app")?.removeAttribute("style")
    }
})


const { data, isFetching, refetch, isRefetching } = useQuery({
    queryKey: ['geoSearch', inputValue.value],
    queryFn: geoQueryFetch,
    initialData: null,
    enabled: false,
})

const debouncedHandler = debounce(onChanges, 500)

const clearInputHander = () => {
    inputValue.value = ""
}

const toggleModalHandler = () => {
    showModel.value = !showModel.value
    if (showModel.value) {
        seachTl.play()
    } else {
        seachTl.reverse()
    }
}

const onSumbitHandler = (city: Location) => {
    if (city) {
        localStorage.setItem("location", JSON.stringify(city))
        locationStore.setLocationState(city)
    }
    toggleModalHandler()
}


onBeforeMount(() => {
    debouncedHandler.cancel()
})

</script>



<template>
    <div class="w-[18.75rem] h-[3.1875rem] relative flex justify-end items-center">
        <i class="pi pi-map ml-4 text-white absolute right-0 top-1/2 -translate-y-1/2" style="font-size: 1.5rem;"
            v-on:click="toggleModalHandler"></i>
        <div class="fixed w-screen h-screen top-0 left-0 z-[40] hidden" ref="inputOverlay">
            <div class="w-full h-full relative flex justify-center items-start pt-[12%]">
                <div class="w-full h-full bg-[#1E1E1Ebd] backdrop-blur-sm absolute left-0 top-0 z-10" id="searchModal"
                    v-on:click="toggleModalHandler">
                </div>
                <div class="w-[25rem] h-[3.1875rem] relative opacity-0 z-20" ref="inputSeach">
                    <i class="pi pi-map ml-4 text-white absolute left-0 top-1/2 -translate-y-1/2"
                        style="font-size: 1.5rem;"></i>
                    <i class="pi pi-times mr-4 text-white absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                        v-on:click="clearInputHander" style="font-size: 1rem;"></i>
                    <input type="text"
                        class="w-full h-full rounded-xl text-[#dae2eb] pl-[3rem] bg-secondary outline-none border-transparent"
                        id="searchInputField" v-on:input="debouncedHandler" v-model="inputValue"
                        placeholder="Search city" />
                    <div class="w-full bg-secondary mt-2 rounded-md flex justify-start items-center flex-col max-h-[25rem] overflow-scroll"
                        :class="(isRefetching || loading || isFetching) && ' min-h-[12.5rem] justify-center'">
                        <i v-if="(isRefetching || loading || isFetching)" class="pi pi-spin pi-spinner text-[#dae2eb]"
                            style="font-size: 2.5rem"></i>
                        <div v-else class="w-full h-full flex justify-center items-center flex-col">
                            <div v-if="data?.results?.length! > 0 && inputValue" v-for="item in data?.results"
                                class="w-full h-auto px-6 py-4 flex justify-between items-center border-b border-[#3A3A3A] cursor-pointer gap-8"
                                v-on:click="onSumbitHandler(item)">
                                <div class="w-auto h-auto flex justify-start items-start gap-2">

                                    <i class="text-[#dae2eb]">{{ getUnicodeFlagIcon(item.country_code)
                                        }}</i>
                                    <h1 class="text-[#dae2eb] font-semibold">
                                        {{ item.name }}</h1>
                                </div>
                                <p class="text-white font-light text-[0.875rem]">
                                    {{ item.admin1 }}
                                    {{ item.admin2 && ", " + item.admin2 }}
                                    {{ item.admin3 && ", " + item.admin3 }}
                                    {{ item.admin1 && ", " }} {{ item.country }}
                                </p>
                            </div>
                            <div v-else-if="inputValue"
                                class="w-full h-[12.5rem] flex flex-col justify-center items-center relative gap-1">
                                <i class="pi pi-map text-[#9fa1a3]" style="font-size: 2rem;"></i>
                                <p class="text-[#9fa1a3] text-sm text-center w-[7.5rem]">Location Not Found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>