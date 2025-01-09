<script setup lang="ts">
import { computed } from 'vue';
import { CurrentAirData } from '../../types/airTypes';
import ProgressVertical from '../svg/ProgressVertical.vue';
import { getAirlive } from '../../utils/utils';


const props = defineProps({
    airCurrent: Object as () => CurrentAirData,
})


const airLiveStatistics = computed(() => {
    if (props.airCurrent) {
        return getAirlive(props.airCurrent.pm10, props.airCurrent.carbon_dioxide, props.airCurrent.sulphur_dioxide, props.airCurrent.ozone)
    }
})




</script>





<template>

    <div class="w-full h-auto grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-8">
        <div v-for="item of airLiveStatistics" class="w-full h-auto flex justify-start items-center gap-4 pl-1">
            <ProgressVertical :progressWidth="'0.625rem'" :progressHeight="'5rem'" :colorBackgroud="item.colorbg"
                :colorFill="item.color" :overAllValue="item.max" :currentValue="item.value" />
            <div class="flex flex-col">
                <p class="text-[#dae2eb] font-light text-[0.875rem]">{{ item.name }} (μg/m³)</p>
                <p class="text-white font-semibold text-xl">{{ item.value }}</p>
            </div>
        </div>
    </div>

</template>