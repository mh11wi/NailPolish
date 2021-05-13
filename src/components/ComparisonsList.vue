<template>
  <div class="container-fluid mt-3">
    <span v-if="comparisons.length == 0" class="ml-5">
      Start by adding a new comparison list from the <strong>Browse Collection</strong> view or by clicking <strong>+ Add Comparison</strong> below.
    </span>
    <Comparison v-else v-for="(comparison, index) in comparisons" :key="index" :comparison="comparison" @deleteComparison="deleteComparison"/>
    <div class="row mt-3 mb-3">
      <b-button variant="link" class="text-decoration-none ml-5" @click="addComparison"><strong>+ Add Comparison</strong></b-button>
    </div>
  </div>
</template>

<script>
import Comparison from './Comparison.vue'

export default {
  name: 'ComparisonsList',
  components: {
    Comparison
  },
  props: ['comparisons'],
  methods: {
    addComparison() {
      const newName = 'Comparison ' + (this.comparisons.length + 1);
      this.comparisons.push({name: newName, polishes: []});
    },
    
    deleteComparison(event) {
      this.comparisons.splice(event, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
