<template>
  <b-form-radio-group v-if="showFinishToggle" buttons button-variant="primary" v-model="selected" :options="options" @change="updateValue()"/>
</template>

<script>
/** A toggle for selecting whether polishes should be displayed as glossy or matte. */
export default {
  name: 'FinishToggle',
  props: [
    'value' // either 'glossy' or 'matte'
  ],
  data: function() {
    return {
      selected: this.value, // which finish is selected
      options: [ // data to display in the toggle
        { text: 'Glossy', value: 'glossy' },
        { text: 'Matte', value: 'matte' }
      ]
    }
  },
  watch: {
    /** Updates the selection when the value changes. */
    value: function() {
      this.selected = this.value;
    }
  },
  methods: {
    /** Updates the value in the parent component. */
    updateValue() {
      this.$emit("updateFinish", this.selected);
    },
  },
}
</script>
