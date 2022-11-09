<template>
  <div role="main" class="app d-flex flex-column">
    <b-navbar variant="primary">
      <b-navbar-brand tag="h1" class="mb-0">{{ collector }}'s Nail Polishes</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :link-attrs="{id: 'info-link', tabindex: '0', 'aria-label': 'App Info'}">
          <font-awesome-icon icon="info-circle" size="lg"/>
        </b-nav-item>
        <b-popover variant="info" target="info-link" title="App Info" triggers="click blur">
          <p>I created this application to track my collection of nail polishes and showcase some of my favourite nail art looks.</p>
          <p><strong>Browse Collection</strong><br>Search or filter through my collection of nail polishes.</p>
          <p><strong>Compare Polishes</strong><br>Compare similar polishes next to one another.</p>
          <p><strong>Top It Off</strong><br>See what different toppers look like over an applicable polish.</p>
          <p><strong>Nail Art Gallery</strong><br>View some of my past nail art.</p>
          <p><strong>Polish Guesser</strong><br>A 'Wordle' inspired game!</p>
          <penguin width="100" hAlign="center"/>
          <p class="text-right">Thanks for visiting!<br>&ndash;mads</p>
        </b-popover>
        <b-nav-item href="https://mh11wi.github.io/" :link-attrs="{'aria-label': 'Home'}">
          <font-awesome-icon icon="home" size="lg"/>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-tabs v-model="tabIndex" class="flex-grow-1 d-flex flex-column" content-class="flex-grow-1">
      <b-tab title="Browse Collection">
        <Collection :allPolishes="polishes" 
                    :toppersMap="toppersMap" 
                    :comparisonId="comparisonId" 
                    :comparisons="comparisons" 
                    @viewToppers="viewToppers" 
                    @incrementComparisonId="incrementComparisonId"
        >
        </Collection>
      </b-tab>
      <b-tab title="Compare Polishes">
        <ComparisonsList :comparisonId="comparisonId" :comparisons="comparisons" @incrementComparisonId="incrementComparisonId"/>
      </b-tab>
      <b-tab title="Top It Off">
        <Toppers :polishes="polishes" :toppersMap="toppersMap" :collectionBasePolish="basePolish"/>
      </b-tab>
      <b-tab title="Nail Art Gallery" lazy>
        <Gallery :polishes="polishes"/>
      </b-tab>
      <b-tab title="Polish Guesser">
        <Guesser :allPolishes="polishes"/>
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
import Guesser from './components/Guesser.vue'
import Penguin from './components/Penguin.vue'

export default {
  name: 'App',
  components: {
    Collection,
    ComparisonsList,
    Toppers,
    Gallery,
    Guesser,
    Penguin
  },
  data: function() {
    return {
      tabIndex: 0, // which tab is displayed
      basePolish: null, // the polish selected to view toppers over
      comparisonId: 0, // an identifier for a new comparison
      comparisons: [], // the list of polish comparisons
      collector: process.env.VUE_APP_COLLECTOR // the name of the collector to display in the navbar
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
  /** Adds listener for when the browser is resized so that the tabs resize appropriately. */
  created() {
    window.addEventListener('resize', this.debounce(this.handleResize));
    this.handleResize();
  },
  /** Removes browser resize listener. */
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    /**
     * Opens the 'Top It Off' tab with the specified base polish and topper selected.
     * @param event - object containing base polish and selected topper id
     */
    viewToppers(event) {
      this.basePolish = event;
      this.tabIndex = 2;
    },
    
    /** Increments the comparison id. */
    incrementComparisonId() {
      this.comparisonId++;
    },
    
    /** 
     * Debounces the call of a specified function.
     * @param func - the function to debounce
     */
    debounce(func){
      let timer;
      return function(event) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(func, 100, event);
      };
    },
    
    /** 
     * Calculates the available height of the screen to size tabs appropriately.
     * On mobile, this does not include the address bar. If the height is too small,
     * e.g. the keyboard is open in landscape mode, ensure header can be scrolled away.
     */
    handleResize() {
      const headerHeight = 110;
      const screenHeight = document.querySelectorAll('html')[0].offsetHeight;
      const height = screenHeight < 2 * headerHeight ? screenHeight : screenHeight - headerHeight;
      document.documentElement.style.setProperty('--height', `${height}px`);
    }
  }
}
</script>

<style>
html, body, .app {
  height: 100%;
}

.tab-pane, .tab-content {
  height: calc(100vh - 110px);
  height: var(--height);
  overflow-y: auto;
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
  max-height: 95%;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-dialog {
  min-width: 750px;
}

.modal-dialog h2 {
  font-size: 1.25rem;
}
</style>
