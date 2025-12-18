<template>
  <BTab ref="tab" :lazy="notActivated" @click="notActivated = false">
    <template v-slot:title><slot name="title">{{ title }}</slot></template>
    <slot></slot>
  </BTab>
</template>

<script>
import { BTab } from 'bootstrap-vue'

export default {
  components: { BTab },
  props: [ 'title' ],
  data() {
    return {
      notActivated: true
    }
  },
  methods: {
    activate() {
      this.$refs.tab.activate();
      this.notActivated = false;
    }
  }
}
</script>