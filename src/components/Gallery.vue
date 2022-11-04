<template>
  <div id="gallery" class="container-fluid mh-100">
    <div v-if="nailArt.length == 0" class="mt-3">
      No nail art found! Check back soon.
    </div>
    <div v-else class="mb-3">
      <NailArt v-for="(entry, index) in nailArt" :key="index" :entry="entry" :polishes="polishes"/>
    </div>
  </div>
</template>

<script>
import nailArtData from '../data/nailArt.json'
import NailArt from './NailArt.vue'

/** The 'Nail Art Gallery' tab, which displays a list of nail art and their polishes. */
export default {
  name: 'Gallery',
  components: {
    NailArt
  },
  props: [
    'polishes' // data of all polishes
  ],
  data: function() {
    return {
      popoverId: '' // the id of the polish popover open
    }
  },
  /** Add listeners that ensure the shown polish popover is hidden on scroll (but not the app info popover). */
  mounted() {
    document.getElementById('gallery').addEventListener('scroll', this.hidePopover);
    
    this.$root.$on('bv::popover::show', bvEventObj => {
      if (bvEventObj.target.id != 'info-link') {
        this.popoverId = bvEventObj.target.id;
      }
    });
  },
  computed: {
    /** Nail art data, sorted descendingly. */
    nailArt: function() {
      return nailArtData.sort((a, b) => b.id - a.id);
    }
  },
  methods: {
    /** Hides the polish popover. */
    hidePopover() {
      this.$root.$emit('bv::hide::popover', this.popoverId);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
