<template>
  <div class="gallery container-fluid">
    <div class="mb-3">
    <NailArt v-for="(entry, index) in nailArt" :key="index" :entry="entry"/>
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
  height: calc(100vh - 110px);
  overflow-y: auto;
}
</style>
