<template>
  <div class="container-fluid mb-3">
    <NailArt v-for="(entry, index) in nailArt" :key="index" :entry="entry" />
  </div>
</template>

<script>
import nailArtData from '../data/nailArt.json'
import NailArt from './NailArt.vue'

export default {
  name: 'Gallery',
  components: {
    NailArt
  },
  computed: {
    nailArt: function() {
      return nailArtData.sort((a, b) => b.id - a.id);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
