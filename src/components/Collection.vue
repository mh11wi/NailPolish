<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 filtersColumn">
        <div class="row align-items-center stats">
          <div class="col-6">
            Polishes: {{ displayedPolishes.length }} / {{ polishes.length }}
          </div>
          <div class="col-6 pl-0 text-right">
            <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
          </div>
        </div>
        <div class="row search mt-4">
          <div class="col">
            <b-input-group>
              <b-form-input v-model="search" placeholder="Search by name" @keyup.enter="doSearch"/>
              <b-input-group-append>
                <b-button variant="primary" @click="doSearch()" :disabled="search.length == 0">Search</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
        <div v-if="search.length == 0" class="row filters mt-4 mb-3">
          <div class="col">
            <FilterList label="Brand" filter="brand" :collection="polishes" @updatePolishList="filterPolishList"/>
            <FilterList label="Type" filter="type" :collection="polishes" @updatePolishList="filterPolishList"/>
            <FilterList label="Colour" filter="colorFamily" :collection="polishes" @updatePolishList="filterPolishList"/>
          </div>
        </div>
      </div>
      <div class="col-8 polishList">
        <div v-if="displayedPolishes.length == 0">
          No polishes found! Try adjusting your filters or search criteria.
        </div>
        <div v-else>
          <b-row cols="3" cols-lg="4" cols-xl="5" class="px-2">
            <PolishTile v-for="(polish, index) in displayedPolishes" 
                        :key="index" 
                        :polish="polish" 
                        :finish="finish" 
                        :hasToppers="toppersMap[polish.id] != null"
                        :comparisons="comparisons"
                        @viewToppers="viewToppers"
            >
            </PolishTile>
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

export default {
  name: 'Collection',
  components: {
    FinishToggle,
    FilterList,
    PolishTile
  },
  data: function() {
    return {
      finish: 'glossy',
      brandFilters: [],
      typeFilters: [],
      colorFilters: [],
      search: '',
      displayedPolishes: []
    }
  },
  props: ['allPolishes', 'toppersMap', 'comparisons'],
  watch: {
    search: function(newVal, oldVal) {
      this.brandFilters = [];
      this.typeFilters = [];
      this.colorFilters = [];
      
      if (oldVal == '' || newVal == '') {
        this.displayedPolishes = this.polishes;
      }
    }
  },
  mounted: function() {
    this.displayedPolishes = this.polishes;
  },
  computed: {
    polishes: function() {
      return this.allPolishes.filter(polish => polish.type != 'Topper' && polish.type != 'Multichrome').sort((a, b) => b.id - a.id);
    }
  },
  methods: {
    doesPolishSatisfyFilters(polish) {
      return (this.brandFilters.length == 0 || this.brandFilters.includes(polish.brand))
               && (this.typeFilters.length == 0 || this.typeFilters.includes(polish.type))
               && (this.colorFilters.length == 0 || this.colorFilters.includes(polish.colorFamily));
    },
    
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
    
    doesPolishSatisySearchTerm(polish) {
      const polishName = polish.name.toLowerCase();
      const searchTerm = this.search.toLowerCase();
      return polishName.indexOf(searchTerm) != -1;
    },
    
    doSearch() {
      this.displayedPolishes = this.polishes.filter(this.doesPolishSatisySearchTerm);
    },
    
    viewToppers(event) {
      this.$emit("viewToppers", event);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filtersColumn {
  padding-top: 1rem;
  border-right: solid 1px #dee2e6;
}

.polishList {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  min-height: calc(100vh - 110px);
}
</style>
