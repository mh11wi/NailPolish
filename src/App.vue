<template>
  <div>
    <b-navbar>
      <b-navbar-brand tag="h1" class="mb-0">Nail Polish App</b-navbar-brand>
    </b-navbar>
    <Collection msg="Coming soon!"/>
    <img alt="Ethereal Chill" src="./assets/ethereal_chill.jpg">
  </div>
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
