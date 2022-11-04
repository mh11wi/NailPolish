<template>
  <div class="comparisonsList container-fluid mh-100">
    <div class="row mx-0 mt-3">
      <span v-if="comparisons.length == 0" class="ml-5 mb-4">
        Start by adding a new comparison from the <strong>Browse Collection</strong> view or by clicking <strong>+ Add Comparison</strong> below.
      </span>
      <Comparison v-else 
        v-for="comparison in comparisons" 
        :key="comparison.id" 
        :comparison="comparison"
        :cardHeight="cardHeight"
        @deleteComparison="deleteComparison"
        @resize="handleResize"
      >
      </Comparison>
    </div>
    <div class="row mb-3">
      <b-button variant="link" class="text-decoration-none ml-5" @click="addComparison"><strong>+ Add Comparison</strong></b-button>
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
    'comparisons' // the list of comparisons
  ],
  data: function() {
    return {
      cardHeight: 0 // the height the Bootstrap card (containing polish info) should be, i.e. same as width, which varies on window size
    }
  },
  /** Adds listener for when the browser is resized so that the polish cards resize appropriately. */
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  /** Removes browser resize listener. */
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
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
    },

    /** Resizes the height of all polish cards so that they are proportional to their width. */
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
