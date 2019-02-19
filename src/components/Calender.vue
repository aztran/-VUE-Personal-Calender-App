<template>
  <kalendar :configuration="calendar_settings" :appointments="appointments"/>

</template>

<script>
import { Kalendar } from 'kalendar-vue';
import '@kalendar-vue/dist/kalendar-vue.css';
export default {
  name: 'calender',
  components: {
    Kalendar,
  },
}
</script>

<style>

</style>
