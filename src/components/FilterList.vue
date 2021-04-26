<template>
  <b-card no-body class="mb-1">
    <b-button block variant="white" v-b-toggle="filter">
      <div class="row">
        <div class="col-6 text-left">{{ filter }}</div>
        <div class="col-6 text-right"><span class="when-open">-</span><span class="when-closed">+</span></div>
      </div>
    </b-button>
    <b-collapse :id="filter">
      <b-card-body>
        <b-card-text>
          
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'FilterList',
  props: ['filter'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}
</style>
