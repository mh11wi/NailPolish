<template>
  <div class="container-fluid mt-3 mb-3">
    <div class="row ml-0 mr-0">
      <span v-if="comparisons.length == 0" class="ml-5 mb-4">
        Start by adding a new comparison from the <strong>Browse Collection</strong> view or by clicking <strong>+ Add Comparison</strong> below.
      </span>
      <Comparison v-else 
        v-for="(comparison, index) in comparisons" 
        :key="index" 
        :comparison="comparison"
        :cardHeight="cardHeight"
        @deleteComparison="deleteComparison"
        @resize="handleResize"
      >
      </Comparison>
    </div>
    <div class="row">
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
  data: function() {
    return { 
      cardHeight: 0
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    addComparison() {
      const newName = 'Comparison ' + (this.comparisons.length + 1);
      this.comparisons.push({name: newName, polishes: []});
    },
    
    deleteComparison(event) {
      this.comparisons.splice(event, 1);
    },

    handleResize() {
      const polish = document.querySelectorAll('.carousel-inner > .active .polish')[0];
      if (polish && polish.offsetWidth != 0) {
        this.cardHeight = polish.offsetWidth;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
