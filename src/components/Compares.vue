<template>
  <div class="container-fluid mt-3">
    <span v-if="compareLists.length == 0" class="ml-5">Start by adding a new comparison list by clicking <strong>+ Add Comparison</strong>.</span>
    <CompareList v-else v-for="(list, index) in compareLists" :key="index" :comparison="list" @deleteList="deleteComparison" />
    <div class="row mt-3">
      <b-button variant="link" class="text-decoration-none ml-5" @click="addComparison"><strong>+ Add Comparison</strong></b-button>
    </div>
  </div>
</template>

<script>
import CompareList from './CompareList.vue'

export default {
  name: 'Compares',
  components: {
    CompareList
  },
  props: ['compareLists'],
  methods: {
    addComparison() {
      this.compareLists.push({name: 'New Comparison', polishes: []});
    },
    
    deleteComparison(event) {
      this.compareLists.splice(event, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
