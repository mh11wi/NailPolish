<template>
  <div role="main" class="app d-flex flex-column">
    <b-navbar variant="primary">
      <b-navbar-brand tag="h1" class="font-weight-normal mb-0">{{ collector }}'s Nail Polishes</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :link-attrs="{id: 'info-link', tabindex: '0', 'aria-label': 'App Info'}">
          <font-awesome-icon icon="info-circle" size="lg"/>
        </b-nav-item>
        <b-popover variant="info" target="info-link" title="App Info" triggers="click blur">
          <p><strong>Browse Collection</strong><br>Search or filter through {{ collector }}'s collection of nail polishes.</p>
          <p><strong>Compare Polishes</strong><br>Compare similar polishes next to one another.</p>
          <p><strong>Top It Off</strong><br>See what different toppers look like over an applicable polish.</p>
          <p><strong>Nail Art Gallery</strong><br>View some of {{ collector }}'s nail art.</p>
        </b-popover>
      </b-navbar-nav>
    </b-navbar>
    <b-tabs v-model="tabIndex" class="flex-grow-1 d-flex flex-column" content-class="flex-grow-1">
      <b-tab title="Browse Collection">
        <Collection
          v-if="polishes.length > 0"
          :allPolishes="polishes" 
          :toppersMap="toppersMap" 
          :comparisonId="comparisonId" 
          :comparisons="comparisons" 
          @viewToppers="viewToppers" 
          @incrementComparisonId="incrementComparisonId"
        />
        <Spinner v-else />
      </b-tab>
      <b-tab title="Compare Polishes">
        <ComparisonsList 
          v-if="polishes.length > 0" 
          :comparisonId="comparisonId" 
          :comparisons="comparisons"
          :cardsPerSlide="cardsPerSlide"
          @incrementComparisonId="incrementComparisonId"
        />
      </b-tab>
      <b-tab title="Top It Off">
        <Toppers 
          v-if="polishes.length > 0" 
          :polishes="polishes" 
          :toppersMap="toppersMap" 
          :collectionBasePolish="basePolish"
        />
      </b-tab>
      <b-tab title="Nail Art Gallery">
        <Gallery v-if="polishes.length > 0" :polishes="polishes"/>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Spinner from './components/Spinner.vue'
import Collection from './components/Collection.vue'
import ComparisonsList from './components/ComparisonsList.vue'
import Toppers from './components/Toppers.vue'
import Gallery from './components/Gallery.vue'

export default {
  name: 'App',
  components: {
    Spinner,
    Collection,
    ComparisonsList,
    Toppers,
    Gallery,
  },
  data: function() {
    return {
      polishes: [], // polish data
      toppersMap: {}, // toppers data
      tabIndex: 0, // which tab is displayed
      basePolish: null, // the polish selected to view toppers over
      comparisonId: 0, // an identifier for a new comparison
      comparisons: [], // the list of polish comparisons
      cardsPerSlide: 2, // the number of polishes to show in a comparison slide
      collector: process.env.VUE_APP_COLLECTOR // the name of the collector to display in the navbar
    }
  },
  /** 
   * Adds listener for when the browser is resized so that the tabs resize appropriately.
   * Also loads polish and topper data.
   */
  created() {
    window.addEventListener('resize', this.debounce(this.handleResize));
    this.handleResize();

    setTimeout(() => {
      this.polishes = require('@/data/polishes.json');
      this.toppersMap = require('@/data/toppersMap.json');
    }, 500);
  },
  /** Ensure that the tabs are the correct height. */
  updated() {
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
     * Determines the correct number of polishes to show in a comparison based on the screen width.
     * Also sets input font size so it is large enough that it will not be zoomed into on mobile.
     */
    handleResize() {      
      const screenWidth = document.querySelectorAll('html')[0].offsetWidth;
      if (screenWidth < 992) {
        this.cardsPerSlide = 2;
      } else if (screenWidth < 1200) {
        this.cardsPerSlide = 3;
      } else {
        this.cardsPerSlide = 4;
      }
      
      let font = 16;
      if (window.visualViewport.scale < 1) {
        font = 16 / 0.8;
      }
      document.documentElement.style.setProperty('--font', `${font}px`);
    }
  }
}
</script>

<style>
html, body, .app {
  height: 100%;
  height: 100dvh;
}

input[type="search"] {
  font-size: 16px;
  font-size: var(--font);
  touch-action: manipulation;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}

.tab-pane, .tab-content {
  height: calc(100% - 110px);
  height: calc(100dvh - 110px);
  overflow-y: auto;
}

.nav-tabs {
  flex-wrap: nowrap !important;
}

.nav-tabs .nav-item {
  margin-bottom: -2px;
}

.nav-tabs .nav-link {
  padding-top: 15px;
  padding-bottom: 15px;
}

.nav-tabs .nav-link.active {
  font-weight: 500;
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

.b-popover-info {
  min-width: 450px;
  max-height: 95%;
  overflow-y: auto;
  overflow-x: hidden;
}

.b-popover-info .popover-header {
  color: #0c5460 !important;
  font-weight: 500;
}

.modal-dialog h2 {
  font-size: 1.25rem;
}

.modal-md {
  max-width: 90% !important;
}

.modal-lg {
  max-width: 97% !important;
}

@media (min-width: 768px) {
  .modal-md  {
    max-width: 670px !important;
  }
  
  .modal-lg  {
    max-width: 720px !important;
  }
}

@media (orientation: portrait) {
  .modal-dialog-centered {
    align-items: start !important;
    justify-content: start !important;
    padding-top: 20% !important;
  }
}
</style>
