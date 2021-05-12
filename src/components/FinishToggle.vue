<template>
  <b-form-radio-group buttons button-variant="primary" v-model="selected" :options="options" @change="updateValue()"/>
</template>

<script>
export default {
  name: 'FinishToggle',
  props: ['value'],
  data: function() {
    return {
      selected: this.value,
      options: [
          { text: 'Glossy', value: 'glossy' },
          { text: 'Matte', value: 'matte' }
        ]
    }
  },
  watch: {
    value: function() {
      this.selected = this.value;
    }
  },
  methods: {
    updateValue() {
      this.$emit("updateFinish", this.selected);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
