<template>
  <div class="container-fluid h-100">
    <div class="row position-relative h-100">
      <div class="col-6 col-sm-4 filtersColumn mh-100">
        <div class="row align-items-center justify-content-between stats mb-4 hide-xs">
          <div>
            <strong class="mr-1">Polishes:</strong> 
            <span>{{ displayedPolishes.length }} / {{ polishes.length }}</span>
          </div>
          <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
        </div>
        <div class="row ml-0 mb-4 hide-sm">
          <b-button variant="primary" @click="hideMobileFilters" aria-label="Hide filters">
            <span class="mr-2">Close</span> 
            <font-awesome-icon icon="times"/>
          </b-button>
        </div>
        <div class="row search">
          <div class="col">
            <b-input-group>
              <font-awesome-icon icon="search" class="searchIcon"/>
              <b-form-input 
                type="search"
                v-model="search" 
                placeholder="Search by name" 
                @keyup="doSearch" 
                @keyup.enter="$event.target.blur()" 
                :class="search.length == 0 ? 'searchBox' : 'searchBox grouped'"
              />
              <b-input-group-append>
                <b-button variant="primary" @click="clearSearch()" v-if="search.length !== 0" aria-label="Clear">
                  <font-awesome-icon icon="times" size="lg"/>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
        <div v-if="search.length == 0" class="row filters mt-4">
          <div class="col">
            <FilterList class="mb-2" label="Brand" filter="brand" :collection="polishes" :initial="initialBrand" @updatePolishList="filterPolishList"/>
            <FilterList class="mb-2" label="Type" filter="type" :collection="polishes" :initial="initialType" @updatePolishList="filterPolishList"/>
            <FilterList label="Colour" filter="colorFamily" :collection="polishes" :initial="initialColor" @updatePolishList="filterPolishList"/>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-8 polishColumn mh-100">
        <div class="stats-xs mb-3 hide-sm">
          <div class="d-flex justify-content-between align-items-center">
            <b-button variant="primary" @click="showMobileFilters" aria-label="Show filters">
              <font-awesome-icon icon="bars" size="lg"/>
            </b-button>
            <div>
              <strong class="mr-1">Polishes:</strong> 
              <span>{{ displayedPolishes.length }} / {{ polishes.length }}</span>
            </div>
            <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
          </div>
        </div>
        <div :style="{display: (displayedPolishes.length === 0 ? '' : 'none')}">
          No polishes found! Try adjusting your filters or search criteria.
        </div>
        <div class="polishList" :style="{display: (displayedPolishes.length > 0 ? '' : 'none')}">
          <b-row cols="3" cols-sm="4" cols-xl="5" class="px-2">
            <PolishTile 
              v-for="(polish, index) in polishes" 
              :key="index" 
              :polish="polish" 
              :finish="finish" 
              :hasToppers="toppersMap[polish.id] != null"
              :comparisonId="comparisonId"
              :comparisons="comparisons"
              :style="{display: (displayedPolishes.some(p => p.id === polish.id) ? '' : 'none')}"
              @viewToppers="viewToppers"
              @incrementComparisonId="incrementComparisonId"
            />
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue'
import FilterList from './FilterList.vue'
import PolishTile from './PolishTile.vue'

/** The 'Browse Collection' tab, where one can search, filter, and view polish details. */
export default {
  name: 'Collection',
  components: {
    FinishToggle,
    FilterList,
    PolishTile
  },
  props: [
    'allPolishes', // data of all polishes (including toppers, which will be extracted)
    'toppersMap', // data of what polishes have images with which toppers
    'comparisonId', // the id for a new comparison
    'comparisons' // the list of polish comparisons
  ],
  data: function() {
    return {
      finish: 'glossy', // the selected polish finish to display (either 'glossy' or 'matte')
      brandFilters: [], // the selected brands to filter by
      typeFilters: [], // the selected polish types to filter by
      colorFilters: [], // the selected polish colors to filter by
      search: '', // the inputted search term
      displayedPolishes: [], // the subset of polishes displayed based off search or filters
      initialBrand: new URLSearchParams(window.location.search).get('brand'), // the initial brand to be selected
      initialType: new URLSearchParams(window.location.search).get('type'), // the initial type to be selected
      initialColor: new URLSearchParams(window.location.search).get('color') // the initial color to be selected
    }
  },
  watch: {
    /**
     * Resets the filters when searching, ensuring all polishes are searched.
     * Also resets the displayed polishes when the search term is empty.
     * @param newVal - the new inputted search term
     * @param oldVal - the old inputted search term
     */
    search: function(newVal, oldVal) {
      this.brandFilters = [];
      this.typeFilters = [];
      this.colorFilters = [];
      
      if (oldVal == '' || newVal == '') {
        this.displayedPolishes = this.polishes;
      }
    }
  },
  /** Initially sets the polishes to display to all the polishes. */
  mounted: function() {
    this.displayedPolishes = this.polishes;
  },
  computed: {
    /** Initially extract all toppers from the list of polishes. */
    polishes: function() {
      return this.allPolishes.filter(polish => polish.type != 'Topper').sort((a, b) => b.id - a.id);
    }
  },
  methods: {
    /**
     * Verifies whether a polish satisfies the three filters (brand, type, and color).
     * @param polish - the polish to check
     */
    doesPolishSatisfyFilters(polish) {
      return (this.brandFilters.length == 0 || this.brandFilters.includes(polish.brand))
               && (this.typeFilters.length == 0 || this.typeFilters.includes(polish.type))
               && (this.colorFilters.length == 0 || this.colorFilters.includes(polish.colorFamily));
    },
    
    /**
     * When a filter option is checked/unchecked, display the subset of polishes that satisfy the three filters (brand, type, and color).
     * @param filter - the kind of filter option being checked/unchecked (brand, type, or color)
     * @param values - the checked state of all options of that kind
     */
    filterPolishList(filter, values) {
      if (filter == 'brand') {
        this.brandFilters = values;
      } else if (filter == 'type') {
        this.typeFilters = values;
      } else {
        this.colorFilters = values;
      }
    
      this.displayedPolishes = this.polishes.filter(this.doesPolishSatisfyFilters);
    },
    
    /**
     * Verifies whether a polish's name contains the inputted search term.
     * @param polish - the polish to check
     */
    doesPolishSatisySearchTerm(polish) {
      const polishName = polish.name.toLowerCase();
      const searchTerm = this.search.toLowerCase();
      return polishName.indexOf(searchTerm) != -1;
    },
    
    /** Display only the polishes satisfying the search term. */
    doSearch() {
      this.initialBrand = '';
      this.initialType = '';
      this.initialColor = '';
      this.displayedPolishes = this.polishes.filter(this.doesPolishSatisySearchTerm);
    },
    
    /** Clear the search box. */
    clearSearch() {
      this.search = '';
      this.doSearch();
    },
    
    /** 
     * Handle when a polish's 'Top It Off' button is clicked in the parent component.
     * @param event - object containing polish and selected topper id
     */
    viewToppers(event) {
      this.$emit("viewToppers", event);
    },
    
    /** Increments the comparison id in the parent component. */
    incrementComparisonId() {
      this.$emit("incrementComparisonId");
    },
    
    /** Displays the filter column on mobile (portrait mode). */
    showMobileFilters() {
      document.querySelector('.filtersColumn').style.display = 'block';
    },
    
    /** Hides the filter column on mobile (portrait mode). */
    hideMobileFilters() {
      document.querySelector('.filtersColumn').style.display = 'none';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filtersColumn {
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-right: solid 1px #dee2e6;
  overflow-y: auto;
}

@media (width < 576px) {
  .filtersColumn {
    height: 100%;
    position: absolute;
    background-color: #fff;
    z-index: 20;
    display: none;
  }
}

@media (min-width: 576px) {
  .filtersColumn {
    display: block !important;
  }
}

.stats {
  padding: 0 1rem;
  gap: 7.5px;
}

.polishColumn {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  overflow: hidden;
}

.stats-xs {
  border-bottom: 1px solid #dee2e6;
  margin: -1rem;
  padding: 1rem;
}

.polishList {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100% + 2rem);
  margin: -1rem;
  padding: 1rem;
}

@media (width < 576px) {
  .polishList {
    max-height: calc(100% - 2rem);
  }
}

.searchIcon {
  position: absolute; 
  top: 50%; 
  left: 0.5rem;
  transform: translateY(-50%);
  z-index: 100;
}

.searchBox {
  padding-left: 2rem;
  border-radius: 0.25rem !important;
}

.searchBox.grouped {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
