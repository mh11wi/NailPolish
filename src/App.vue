<template>
  <div>
    <b-navbar variant="primary">
      <b-navbar-brand>Nail Polish App</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item id="link-button" tabindex="0">
          <font-awesome-icon icon="info-circle" size="lg" />
        </b-nav-item>
        <b-popover variant="info" target="link-button" title="App Info" triggers="focus">
          <p>I created this application to track my collection of nail polishes and showcase some of my favourite nail art looks.</p>
          <p><strong>Browse Collection</strong><br>Sort or filter through my collection of nail polishes.</p>
          <p><strong>Compare Polishes</strong><br>Select different polishes to compare in depth.</p>
          <p><strong>Top It Off</strong><br>See what different toppers look like over a particular polish.</p>
          <p><strong>Nail Art Gallery</strong><br>View some of my past nail art looks.</p>
        </b-popover>
        <b-nav-item href="https://mh11wi.github.io/">
          <font-awesome-icon icon="home" size="lg" />
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-tabs v-model="tabIndex">
      <b-tab title="Browse Collection">
        <Collection :allPolishes="polishes" :toppersMap="toppersMap" @viewToppers="viewToppers" />
      </b-tab>
      <b-tab title="Compare Polishes">
        <p class="ml-3 mt-3">Coming Soon!</p>
      </b-tab>
      <b-tab title="Top It Off">
        <Toppers :polishes="polishes" :toppersMap="toppersMap" :basePolish="basePolish" :defaultTopperId="topperId" />
      </b-tab>
      <b-tab title="Nail Art Gallery">
        <p class="ml-3 mt-3">Coming Soon!</p>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import polishes from './data/polishes.json'
import toppersMap from './data/toppersMap.json'
import Collection from './components/Collection.vue'
import Toppers from './components/Toppers.vue'

export default {
  name: 'App',
  components: {
    Collection,
    Toppers
  },
  data: function() {
    return {
      tabIndex: 0,
      basePolish: null,
      topperId: ''
    }
  },
  computed: {
    polishes: function() {
      return polishes;
    },
    toppersMap: function() {
      return toppersMap;
    }
  },
  methods: {
    viewToppers(event) {
      this.basePolish = event.basePolish;
      this.topperId = event.finish == 'glossy' ? 1 : 2;
      this.tabIndex = 2;
    }
  }
}
</script>

<style>
.nav-tabs .nav-item {
  margin-bottom: -2px;
}

.nav-tabs .nav-link {
  padding-top: 15px;
  padding-bottom: 15px;
}

.nav-tabs .nav-link:hover {
  border: none;
}

.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link {
  border: none;
  box-shadow: inset 0 -4px 0 pink;
}

.nav-tabs .nav-link, .nav-tabs .nav-link:visited { 
  outline: none;
}

.nav-tabs .nav-link:focus, .nav-tabs .nav-link:active {
  border: 1px dotted #dee2e6 !important;
}

.popover {
  min-width: 400px;
}

.modal-dialog {
  min-width: 750px;
}
</style>
