<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 filtersColumn">
        <div class="row align-items-center stats">
          <div class="col-6">
            Polishes: {{ filteredPolishes.length }} / {{ polishes.length }}
          </div>
          <div class="col-6 text-right">
            <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
          </div>
        </div>
        <div class="row search mt-3">
          <div class="col">
            <b-input-group>
              <b-form-input placeholder="Search"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary">Search</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
        <div class="row filters mt-3 mb-3">
          <div class="col">
            <FilterList label="Brand" filter="brand" :collection="polishes" @updatePolishList="filterPolishList"/>
            <FilterList label="Type" filter="type" :collection="polishes" @updatePolishList="filterPolishList"/>
            <FilterList label="Colour" filter="colorFamily" :collection="polishes" @updatePolishList="filterPolishList"/>
          </div>
        </div>
      </div>
      <div class="col-8 polishList">
        <div v-if="filteredPolishes.length == 0">
          No polishes found! Try adjusting your filters or search criteria.
        </div>
        <div v-else>
          <div class="row">
            <PolishTile v-for="(polish, index) in filteredPolishes" :key="index" :polish="polish" :finish="finish"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue'
import FilterList from './FilterList.vue'
import PolishTile from './PolishTile.vue'
import allPolishes from '../data/polishes.json'

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
      filteredPolishes: [],
      brandFilters: [],
      typeFilters: [],
      colorFilters: [],
    }
  },
  mounted: function() {
    this.filteredPolishes = this.polishes;
  },
  computed: {
    polishes: function() {
      return allPolishes.filter(polish => polish.type != 'Topper');
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
    
      this.filteredPolishes = this.polishes.filter(this.doesPolishSatisfyFilters);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filtersColumn {
  padding-top: 1rem;
  border-right: solid 1px #dee2e6;
  height: 100%;
}

.polishList {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
}
</style>
