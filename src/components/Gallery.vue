<template>
  <div class="gallery container-fluid mh-100">
    <div class="mb-3">
    <NailArt v-for="(entry, index) in nailArt" :key="index" :entry="entry" :polishes="polishes"/>
    </div>
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
  props: ['polishes'],
  computed: {
    nailArt: function() {
      return nailArtData.sort((a, b) => b.id - a.id);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gallery {
  overflow-y: auto;
}
</style>
