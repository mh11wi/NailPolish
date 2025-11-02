<template>
  <BTab :lazy="notActivated" @click="notActivated = false">
    <template v-slot:title><slot name="title">{{ title }}</slot></template>
    <slot></slot>
  </BTab>
</template>

<script>
  import { BTab } from 'bootstrap-vue'
  export default {
    components: { BTab },
	props: [ 'title', 'active' ],
    data() {
      return {
        notActivated: true
      }
    }
  }
</script>