<template>
  <Collection msg="Nail Polish App"/>
  <img alt="Ethereal Chill" src="./assets/ethereal_chill.jpg">
</template>

<script>
import Collection from './components/Collection.vue'

export default {
  name: 'App',
  components: {
    Collection
  }
}
</script>

<style>
img {
  width: 300px;
}
</style>
