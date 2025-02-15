<template>
  <div role="main" class="app d-flex flex-column">
    <b-navbar variant="primary">
      <b-navbar-brand tag="h1" class="font-weight-normal mb-0">{{ collector }}'s Nail Polishes</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :link-attrs="{id: 'info-link', tabindex: '0', 'aria-label': 'App Info'}">
          <font-awesome-icon icon="info-circle" size="lg"/>
        </b-nav-item>
        <b-popover variant="info" target="info-link" placement="leftbottom" :fallback-placement="[]" title="App Info" triggers="click blur">
          <p>An application to track my collection of nail polishes and showcase nail art.</p>
          <p><strong>Browse Collection</strong><br>Search or filter through my collection of nail polishes.</p>
          <p><strong>Compare Polishes</strong><br>Compare similar polishes next to one another.</p>
          <p><strong>Top It Off</strong><br>See what different toppers look like over an applicable polish.</p>
          <p><strong>Nail Art Gallery</strong><br>View some of my past nail art.</p>
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
    Gallery
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
    }, 1000);
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
    
    /** Determines the correct number of polishes to show in a comparison based on the screen width. */
    handleResize() {
      const screenWidth = document.querySelectorAll('html')[0].offsetWidth;
      if (screenWidth < 576) {
        this.cardsPerSlide = 2;
      } else if (screenWidth < 1200) {
        this.cardsPerSlide = 3;
      } else {
        this.cardsPerSlide = 4;
      }
    }
  }
}
</script>

<style>
html {
  transform: scale(1.0);
  transform-origin: 0 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

html::-webkit-scrollbar { 
  display: none;
}

html, body, .app {
  width: 100%;
  width: 100dvw;
  height: 100%;
  height: 100dvh;
}

.tab-pane, .tab-content {
  height: calc(100% - 110px);
  height: calc(100dvh - 110px);
  overflow-y: auto;
}

/* Mobile - Portrait and Landscape modes */
@media (orientation: portrait) and (width < 576px), (height < 576px) {
  html {
    transform: scale(0.7);
  }
  
  body, .app, .modal, .modal-backdrop {
    width: 142.857% !important;
    width: 142.857dvw !important;
    height: 142.857% !important;
    height: 142.857dvh !important;
  }
  
  .tab-pane, .tab-content {
    height: calc(142.857% - 110px);
    height: calc(142.857dvh - 110px);
  }
  
  .b-popover-info {
    left: calc(142.857% - 450px - 3.5rem) !important;
    transform: translate(0, 1rem) !important;
  }
  
  .dropdown-menu {
    transform: translate(0, 38px) !important;
  }
}

/* Tablet - Portrait mode */
@media (orientation: portrait) and (min-width: 576px) {
  html {
    transform: scale(0.78125);
  }
  
  body, .app, .modal, .modal-backdrop {
    width: 128% !important;
    width: 128dvw !important;
    height: 128% !important;
    height: 128dvh !important;
  }
  
  .tab-pane, .tab-content {
    height: calc(128% - 110px);
    height: calc(128dvh - 110px);
  }
  
  .b-popover-info {
    left: calc(128% - 450px - 3.5rem) !important;
    transform: translate(0, 1rem) !important;
  }
  
  .dropdown-menu {
    transform: translate(0, 38px) !important;
  }
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}

.nav-tabs {
  flex-wrap: nowrap !important;
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tabs .nav-item {
  margin-bottom: -2px;
  white-space: nowrap;
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
}

.b-popover-info .arrow {
  top: 0 !important;
}

.b-popover-info .popover-header {
  color: #0c5460 !important;
  font-weight: 500;
}

.b-popover-info .popover-body {
  overflow-y: auto;
  max-height: calc(128% - 20px);
  max-height: calc(128dvh - 20px);
}

.b-popover-info a {
  color: #0c5460;
  font-size: 85%;
  text-decoration: underline;
}

.modal-dialog h2 {
  font-size: 1.25rem;
}

.modal-dialog-centered {
  justify-content: center !important;
}

.modal-md, .modal-md .modal-content {
  max-width: 680px !important;
}

.modal-lg, .modal-lg .modal-content {
  max-width: 720px !important;
}

.hide-sm {
  display: none !important;
}

@media (width < 576px) {
  .b-popover-info {
    min-width: 395px;
	left: calc(142.857% - 395px - 3.5rem) !important;
  }

  .modal-md, .modal-lg {
    max-width: 100% !important;
  }
  
  .hide-xs {
    display: none !important;
  }
  
  .hide-sm {
    display: block !important;
  }
}

@media (orientation: portrait) {
  .modal-dialog-centered {
    align-items: start !important;
    padding-top: 22.5% !important;
  }
  
  .modal-dialog-centered.modal-dialog-scrollable {
    align-items: center !important;
    justify-content: start !important;
  }
  
  @media (width < 576px) {
    .modal-md .modal-content {
      max-width: 92% !important;
    }

    .modal-lg .modal-content {
      max-width: 98% !important;
      font-size: 13px;
    }
  }
  
  @media (max-width: 360px) {
    .modal-lg .modal-content {
      max-width: 99% !important;
      font-size: 11.5px;
    }
  }
}

@media (min-width: 576px) and (max-height: 320px), (width < 576px) and (max-height: 400px) {
  .modal-content {
    max-height: 100%;
    max-height: 100dvh; 
    overflow: auto;
  }
}
</style>
