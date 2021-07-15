<template>
  <div id="gallery" class="container-fluid mh-100">
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
  data: function() {
    return {
      popoverId: ''
    }
  },
  mounted() {
    document.getElementById('gallery').addEventListener('scroll', this.hidePopover);
    
    this.$root.$on('bv::popover::show', bvEventObj => {
      if (bvEventObj.target.id != 'info-link') {
        this.popoverId = bvEventObj.target.id;
      }
    });
  },
  computed: {
    nailArt: function() {
      return nailArtData.sort((a, b) => b.id - a.id);
    }
  },
  methods: {  
    hidePopover() {
      this.$root.$emit('bv::hide::popover', this.popoverId);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#gallery {
  overflow-y: auto;
}
</style>
