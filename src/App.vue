<template>
  <div class="app d-flex flex-column">
    <b-navbar variant="primary">
      <b-navbar-brand>{{$root.$options.constants.name}}'s Nail Polishes</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :link-attrs="{id: 'info-link', tabindex: '0'}">
          <font-awesome-icon icon="info-circle" size="lg"/>
        </b-nav-item>
        <b-popover variant="info" target="info-link" title="App Info" triggers="click blur">
          <p><strong>Browse Collection</strong><br>Search or filter through {{$root.$options.constants.name}}'s collection of nail polishes.</p>
          <p><strong>Compare Polishes</strong><br>Compare similar polishes next to one another.</p>
          <p><strong>Top It Off</strong><br>See what different toppers look like over an applicable polish.</p>
          <p><strong>Nail Art Gallery</strong><br>View some of {{$root.$options.constants.name}}'s nail art.</p>
        </b-popover>
      </b-navbar-nav>
    </b-navbar>
    <b-tabs v-model="tabIndex" class="flex-grow-1 d-flex flex-column" content-class="flex-grow-1">
      <b-tab title="Browse Collection">
        <Collection :allPolishes="polishes" :toppersMap="toppersMap" :comparisons="comparisons" @viewToppers="viewToppers"/>
      </b-tab>
      <b-tab title="Compare Polishes">
        <ComparisonsList :comparisons="comparisons"/>
      </b-tab>
      <b-tab title="Top It Off">
        <Toppers :polishes="polishes" :toppersMap="toppersMap" :basePolish="basePolish" :defaultTopperId="topperId"/>
      </b-tab>
      <b-tab title="Nail Art Gallery" lazy>
        <Gallery :polishes="polishes"/>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import polishes from './data/polishes.json'
import toppersMap from './data/toppersMap.json'
import Collection from './components/Collection.vue'
import ComparisonsList from './components/ComparisonsList.vue'
import Toppers from './components/Toppers.vue'
import Gallery from './components/Gallery.vue'

export default {
  name: 'App',
  components: {
    Collection,
    ComparisonsList,
    Toppers,
    Gallery,
  },
  data: function() {
    return {
      tabIndex: 0, // which tab is displayed
      basePolish: null, // the polish selected to view toppers over
      topperId: '', // the id of the topper to first show in the 'Top It Off' tab
      comparisons: [] // the list of polish comparisons
    }
  },
  computed: {
    /** Polish data. */
    polishes: function() {
      return polishes;
    },
    /** Toppers data. */ 
    toppersMap: function() {
      return toppersMap;
    }
  },
  methods: {
    /**
     * Opens the 'Top It Off' tab with the specified base polish and topper selected.
     * @param event - object containing base polish and selected topper id
     */
    viewToppers(event) {
      this.basePolish = event.basePolish;
      this.topperId = event.finish == 'glossy' ? this.$root.$options.constants.glossy : this.$root.$options.constants.matte;
      this.tabIndex = 2;
    }
  }
}
</script>

<style>
html, body, .app {
  height: 100vh;
}

.tab-pane, .tab-content {
  height: calc(100vh - 110px);
}

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

.nav-tabs .nav-link, .nav-tabs .nav-link:visited { 
  outline: none;
}

.nav-tabs .nav-link:focus, .nav-tabs .nav-link:active {
  border: 1px dotted #dee2e6 !important;
}

.popover {
  min-width: 450px;
}

.modal-dialog {
  min-width: 750px;
}
</style>
