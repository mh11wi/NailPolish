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
export default {
  name: 'FilterList',
  props: ['label', 'filter', 'collection'],
  data: function() {
    return {
      selected: []
    }
  },
  computed: {
    filterList: function() {
      return this.pluck(this.collection, this.filter);
    }
  },
  methods: {
    pluck: function(array, key) {
      return [...new Set(array.map(o => o[key]))].sort();
    }
  },
  watch: {
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
