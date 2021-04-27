<template>
  <div>
    <b-navbar variant="primary">
      <b-navbar-brand tag="h1">Nail Polish App</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item id="link-button" tabindex="0">
          <font-awesome-icon icon="info-circle" size="lg" />
        </b-nav-item>
        <b-popover variant="info" target="link-button" title="Info" triggers="focus">
          An application to track my collection of nail polishes and showcase some of my favourite nail art looks.
        </b-popover>
        <b-nav-item href="https://mh11wi.github.io/">
          <font-awesome-icon icon="home" size="lg" />
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-tabs>
      <b-tab title="Browse Collection" active>
        <Collection msg="Coming soon!"/>
      </b-tab>
      <b-tab title="Compare Polishes">
        <p>Coming Soon!</p>
      </b-tab>
      <b-tab title="Top It Off">
        <p>Coming Soon!</p>
      </b-tab>
      <b-tab title="Nail Art Gallery">
        <p>Coming Soon!</p>
      </b-tab>
    </b-tabs>
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

</style>
