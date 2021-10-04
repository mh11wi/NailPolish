<template>
  <b-card no-body class="mb-1">
    <b-button block variant="white" v-b-toggle="filter">
      <div class="row">
        <div class="col-6 text-left">{{ label }}</div>
        <div class="col-6 text-right"><span class="when-open">-</span><span class="when-closed">+</span></div>
      </div>
    </b-button>
    <b-collapse :id="filter" visible>
      <b-card-body class="pt-2 pb-0">
        <b-card-text>
          <b-form-checkbox-group
            v-model="selected"
            :options="filterList"
            :name="filter"
            stacked
          ></b-form-checkbox-group>
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
/** A 'filter list' is a set of options to filter polishes by (i.e. brand, type, or color). */
export default {
  name: 'FilterList',
  props: [
    'label', // the label for the filter
    'filter', // the kind of filter (either 'brand', 'type', or 'color')
    'collection' // the collection of polishes to determine filter options from (excludes toppers)
  ],
  data: function() {
    return {
      selected: [] // the selected options for the filter
    }
  },
  computed: {
    /** Gets the filter options from the collection of polishes. */
    filterList: function() {
      return this.pluck(this.collection, this.filter);
    }
  },
  methods: {
    /**
     * Plucks distinct items from an array satisfying the given key, and then sorts the set.
     * @param array - an array of items
     * @param key - the key to check
     */
    pluck: function(array, key) {
      return [...new Set(array.map(o => o[key]))].sort();
    }
  },
  watch: {
    /**
     * Handle when a filter option is checked/unchecked in the parent component.
     * @param value - the checked state of filter options
     */
    selected(value) {
      this.$emit("updatePolishList", this.filter, value);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}

.show >>> .custom-control {
  padding-bottom: 0.75rem;
}
</style>
