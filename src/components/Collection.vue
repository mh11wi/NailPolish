<template>
  <div class="container-fluid h-100">
    <div class="row position-relative h-100">
      <div class="col-6 col-sm-4 filtersColumn mh-100">
        <div class="row align-items-center justify-content-between stats mb-4 hide-xs">
          <div>
            <strong class="mr-1">Polishes:</strong> 
            <span>{{ displayedPolishes.length }} / {{ polishCount }}</span>
          </div>
          <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
        </div>
        <div class="hide-sm">
          <div class="row align-items-center mb-4">
            <div class="col-6 text-left">
              <b-button variant="primary" @click="hideMobileFilters" aria-label="Hide filters">
                <span class="mr-2">Close</span> 
                <font-awesome-icon icon="times"/>
              </b-button>
            </div>
            <div class="col-6 text-right pr-4">
              <b-button 
			    v-if="search.length == 0"
                variant="link" 
                size="sm" 
                class="px-1 py-0 text-secondary-underline"
                @click="clearFilters"
              >
                Clear all
              </b-button>
            </div>
          </div>
        </div>
		<div v-if="hasAnyDestashed" class="row mb-4">
          <div class="col">
            <b-form-checkbox v-model="includeDestashed" value="true" class="destashedToggle" switch>
			  Include destashed polishes
			</b-form-checkbox>
          </div>
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
            <FilterList ref="brand" class="mb-2" label="Brand" filter="brand" :collection="polishes" :initial="initialBrand" :otherList="otherBrands" @updatePolishList="filterPolishList"/>
            <FilterList ref="type" class="mb-2" label="Type" filter="type" :collection="polishes" :initial="initialType" @updatePolishList="filterPolishList"/>
            <FilterList ref="color" class="mb-0" label="Colour" filter="colorFamily" :collection="polishes" :initial="initialColor" @updatePolishList="filterPolishList"/>
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
              <span>{{ displayedPolishes.length }} / {{ polishCount }}</span>
            </div>
            <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
          </div>
        </div>
        <div v-show="displayedPolishes.length === 0">
          No polishes found! Try adjusting your filters or search criteria.
        </div>
        <div v-show="displayedPolishes.length > 0" class="polishList">
          <b-row cols="3" cols-sm="4" cols-xl="5" class="px-2">
            <PolishTile 
              v-for="(polish, index) in polishes" 
			  v-show="displayedPolishes.some(p => p.id === polish.id)"
              :key="index" 
              :polish="polish" 
              :finish="finish" 
              :hasToppers="toppersMap[polish.id] != null"
              :comparisonId="comparisonId"
              :comparisons="comparisons"
              @viewToppers="viewToppers"
              @incrementComparisonId="incrementComparisonId"
            />
          </b-row>
        </div>
      </div>
	  <div class="filtersOverlay" @click="hideMobileFilters"></div>
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
      initialColor: new URLSearchParams(window.location.search).get('color'), // the initial color to be selected
	  includeDestashed: true // whether destashed polishes should be counted and displayed
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
        this.updateDisplayedPolishes();
      }
    },
    
    /** Further filter out destashed polishes if specified. */
    includeDestashed: function() {
	  this.updateDisplayedPolishes();
    }
  },
  /** Initially sets the polishes to display to all the polishes. */
  mounted: function() {
    this.updateDisplayedPolishes();
  },
  computed: {
    /** Initially extract all toppers from the list of polishes. */
    polishes: function() {
      return this.allPolishes.filter(polish => polish.type != 'Topper').sort((a, b) => b.id - a.id);
    },
	
	/** The number of polishes, excluding toppers and those destashed if specified. */
	polishCount: function() {
	  if (this.includeDestashed) {
	    return this.polishes.length;
	  } else {
	    return this.polishes.filter(polish => !polish.destashed).length;
	  }
	},
    
    /** Whether any polish in the list is destashed. */
    hasAnyDestashed: function() {
      return this.polishes.some(polish => polish.destashed);
    },
	
	/** Determines the list of brands that should be grouped as 'Other'. */
	otherBrands: function() {
	  const brands = this.pluck(this.polishes, 'brand');
	  const other = [];
	  
	  brands.forEach(brand => {
	    if (this.polishes.filter(polish => polish.brand == brand).length <= 6) {
	      other.push(brand);
	    }
	  });
	  
	  return other;
	}
  },
  methods: {
    /** 
     * Verifies whether a polish satisfies the destashed inclusion.
     * @param polish - the polish to check
	 */
	doesPolishSatisfyDestashed(polish) {
	  return this.includeDestashed ? true : !polish.destashed;
	},
	
	/** Update which filters to display based on filters or search. */
	updateDisplayedPolishes() {
	  const doesSatisfy = (polish) => (
	    this.doesPolishSatisfyFilters(polish) && 
		this.doesPolishSatisySearchTerm(polish) && 
		this.doesPolishSatisfyDestashed(polish)
	  );
      this.displayedPolishes = this.polishes.filter(doesSatisfy);
	},
  
    /**
     * Verifies whether a polish satisfies the three filters (brand, type, and color).
     * @param polish - the polish to check
     */
    doesPolishSatisfyFilters(polish) {
      return (
	    (this.brandFilters.length == 0 || this.brandFilters.includes(polish.brand) || (this.brandFilters.includes('Other') && this.otherBrands.includes(polish.brand))) &&
        (this.typeFilters.length == 0 || this.typeFilters.includes(polish.type)) &&
        (this.colorFilters.length == 0 || this.colorFilters.includes(polish.colorFamily))
	  );
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
	  this.updateDisplayedPolishes();
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
      this.updateDisplayedPolishes();
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
	  document.querySelector('.filtersOverlay').style.display = 'block';
    },
    
    /** Hides the filter column on mobile (portrait mode). */
    hideMobileFilters() {
      document.querySelector('.filtersColumn').style.display = 'none';
	  document.querySelector('.filtersOverlay').style.display = 'none';
    },
	
	/** Clears all filters. */
	clearFilters() {
	  this.$refs.brand.clear();
	  this.$refs.type.clear();
	  this.$refs.color.clear();
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
  
  .filtersOverlay {
    display: none !important;
  }
}

.filtersOverlay {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 19;
}

.stats {
  padding: 0 1rem;
  column-gap: 7.5px;
  row-gap: 1.5rem;
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

:deep(.text-secondary-underline) {
  color: var(--secondary);
  text-decoration: underline;
}

:deep(.text-secondary-underline:hover) {
  color: var(--dark);
  text-decoration: underline;
}

.destashedToggle {
  overflow: hidden;
  height: 24px;
}
</style>
