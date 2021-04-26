<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 filtersColumn">
        <div class="row align-items-center stats">
          <div class="col-6">
            Polishes: {{ polishes.length }}
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
        <div class="row filters mt-3">
          <div class="col">
            <FilterList filter="Brand" />
            <FilterList filter="Type" />
            <FilterList filter="Colour" />
          </div>
        </div>
      </div>
      <div class="col-8 polishList">
        <b-img-lazy 
          v-for="(polish, index) in polishes" 
          :key="index" :src="getImage(polish.id)" 
          :alt="polish.name" 
          width=175 
          blank-color="black"
          class="mr-3 mb-3">
        </b-img-lazy>
      </div>
    </div>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue'
import FilterList from './FilterList.vue'
import allPolishes from '../data/polishes.json'

export default {
  name: 'Collection',
  components: {
    FinishToggle,
    FilterList
  },
  data: function() {
    return {
      finish: 'glossy'
    }
  },
  computed: {
    polishes: function() {
      return allPolishes.filter(polish => polish.type != 'Topper');
    }
  },
  methods: {
    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? '1' : '2';
      return require('@/assets/' + polishId + '/' + finishId + '.jpg');
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
