<template>
  <div class="container-fluid">
    <CompareList v-for="(list, index) in compareLists" :key="index" :comparison="list" @deleteList="deleteComparison" />
    <div class="row mt-3">
      <b-button variant="link" class="text-decoration-none add" @click="addComparison">+ Add Comparison</b-button>
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
      this.compareLists.push({name: 'New Comparison'});
    },
    
    deleteComparison(event) {
      this.compareLists.splice(event, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add {
  margin-left: 2rem;
}
</style>
