<template>
  <b-card no-body>
    <b-button block variant="white" v-b-toggle="filter">
      <div class="row font-weight-bold">
        <div class="col-8 text-left">
          <span class="mr-3">{{ label }}</span>
          <font-awesome-icon icon="chevron-up" size="xs" class="when-open"/>
          <font-awesome-icon icon="chevron-down" size="xs" class="when-closed"/>
        </div>
        <div class="col-4 text-right">
          <b-button 
            variant="link" 
            size="sm" 
            class="px-1 py-0 text-secondary-underline"
            @click.stop="clear"
          >
            Clear
          </b-button>
        </div>
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
          />
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
    'collection', // the collection of polishes to determine filter options from (excludes toppers)
    'initial', // the initial value to select
    'otherList' // a list of filters that should be grouped into an 'Other' option
  ],
  data: function() {
    return {
      selected: [] // the selected options for the filter
    }
  },
  /** Select an initial filter option (if present) */
  mounted: function() {
    if (this.filterList.includes(this.initial)) {
      this.selected.push(this.initial);
    }
  },
  computed: {
    /** Gets the filter options from the collection of polishes. */
    filterList: function() {
      const allList = this.pluck(this.collection, this.filter);
      let list = allList;
      
      if (this.otherList && this.otherList.length > 0) {
        list = allList.filter(item => !this.otherList.includes(item));
        list.push('Other');
      }
      
      return list;
    }
  },
  methods: {	
    /** Clears all selected items. */
    clear: function() {
      this.selected = [];
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

.show :deep(.custom-control) {
  padding-bottom: 0.75rem;
}
</style>
