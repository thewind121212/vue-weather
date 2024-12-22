<script setup lang="ts">
import { defineProps } from 'vue';
import { Current } from '../types/weatherTypes';


const props = defineProps({
    data: Object as () => Current,
    isPending: Boolean,
    isError: Boolean,
    isFetching: Boolean
})


</script>


<template>
    <div
        className="col-span-2 row-span-1 bg-[#1A1A1A] rounded-2xl text-[#FFFF] text-5xl p-6">
        {{ data?.temp_c }}°C
    </div>
</template>