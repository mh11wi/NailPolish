<template>
  <div class="comparisonsList container-fluid mh-100">
    <div class="row w-100 mx-0 mt-3">
      <span v-if="comparisons.length == 0" class="mx-3 mx-sm-4 mb-4">
        Start by adding a new comparison from the <strong>Browse Collection</strong> view or by clicking <strong>+ Add Comparison</strong> below.
      </span>
      <Comparison v-else 
        v-for="comparison in comparisons" 
        :key="comparison.id" 
        :comparison="comparison"
        :cardsPerSlide="cardsPerSlide"
        @deleteComparison="deleteComparison"
      />
    </div>
    <div class="row w-100">
      <b-button 
        variant="link" 
        class="text-decoration-none ml-3 ml-sm-4 mb-3" 
        @click="addComparison"
      >
        <strong>+ Add Comparison</strong>
      </b-button>
    </div>
  </div>
</template>

<script>
import Comparison from './Comparison.vue'

/** The 'Compare Polishes' tab, which displays all polish comparisons in separate Bootstrap carousels. */
export default {
  name: 'ComparisonsList',
  components: {
    Comparison
  },
  props: [
    'comparisonId', // the id for a new comparison
    'comparisons', // the list of comparisons
    'cardsPerSlide', // the number of polishes to show in a comparison slide
  ],
  methods: {
    /** Adds a new comparison to the list when the button is clicked. */
    addComparison() {
      const newName = 'Comparison ' + (this.comparisons.length + 1);
      this.comparisons.push({id: this.comparisonId, name: newName, polishes: []});
      this.$emit("incrementComparisonId");
    },
    
    /**
     * Deletes the comparison from the list when the button is clicked.
     * @param event - object containing which comparison to delete
     */
    deleteComparison(event) {
      const index = this.comparisons.findIndex((comparison) => comparison.id == event);
      this.comparisons.splice(index, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (width < 576px) {
  .comparisonsList {
    padding: 0 0.25rem;
  }
}
</style>
