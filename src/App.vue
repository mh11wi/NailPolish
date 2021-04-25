<template>
  <div>
    <b-navbar sticky="true" variant="light">
      <b-navbar-brand tag="h1">Nail Polish App</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item id="link-button" tabindex="0">
          <font-awesome-icon icon="info-circle" />
        </b-nav-item>
        <b-popover variant="info" target="link-button" title="Info" triggers="focus">
          An application to track my collection of nail polishes and showcase some of my favourite nail art looks.
        </b-popover>
        <b-nav-item href="https://mh11wi.github.io/">
          <font-awesome-icon icon="home" />
        </b-nav-item>
      </b-navbar-nav>
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
