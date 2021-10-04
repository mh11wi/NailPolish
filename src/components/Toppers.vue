<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-4 toppersColumn mh-100">
        <b-form-radio-group v-model="selectedTopperId" :options="toppers" class="mt-2" stacked/>
      </div>
      <div class="col-8 display mh-100">
        <div v-if="basePolish == null">
          Start by selecting an applicable base polish from the <strong>Browse Collection</strong> view.
        </div>
        <div v-else>
          <div class="row justify-content-center">
            <b-img-lazy 
              :src="getImage(basePolish.id)" 
              :alt="basePolish.name" 
              width=400
              height=400
              blank-color="black"
            >
            </b-img-lazy>
          </div>
          <div class="mt-2 row justify-content-center"><strong>{{ basePolish.brand }}</strong></div>
          <div class="row justify-content-center">{{ basePolish.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** The 'Top It Off' tab, which displays various toppers over a base polish. */
export default {
  name: 'Toppers',
  props: [
    'toppersMap', // data for which toppers a polish has images of
    'polishes', // data of all polishes
    'basePolish', // the selected base polish to display toppers over
    'defaultTopperId' // which topper should be first selected (including glossy and matte top coat)
  ],
  data: function() {
    return {
      selectedTopperId: ''
    }
  },
  computed: {
    /** Gets the toppers associated to the base polish. */
    toppers: function() {
      const topperIds = [this.$root.$options.constants.glossy, this.$root.$options.constants.matte];
      if (this.basePolish != null && this.toppersMap[this.basePolish.id] != null) {
        topperIds.push(...this.toppersMap[this.basePolish.id]);
      }
      
      const options = [];
      const self = this;
      topperIds.forEach(function(id) {
        const topper = self.polishes[id - 1];
        const optionHtml = topper.brand != '' ? "<strong>" + topper.brand + "</strong> - " + topper.name : topper.name;
        const disabled = self.basePolish == null;
        options.push({html: optionHtml, value: topper.id, disabled: disabled});
      });
      return options;
    }
  },
  watch: {
    /** Updates the selected topper when base polish changes to the default. */
    basePolish: function() {
      this.selectedTopperId = this.defaultTopperId;
    },
    
    /** Updates the selected topper when the default topper changes to the new default. */
    defaultTopperId: function() {
      this.selectedTopperId = this.defaultTopperId;
    }
  },
  methods: {
    /**
     * Gets the specified polish image.
     * @param polishId - the id of the polish to display the selected topper over
     */
    getImage(polishId) {
      return require('@/assets/images/polishes/' + polishId + '/' + this.selectedTopperId + this.$root.$options.constants.extension);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toppersColumn {
  padding-top: 1rem;
  border-right: solid 1px #dee2e6;
  overflow-y: auto;
}

.toppersColumn >>> .custom-control {
  padding-bottom: 0.75rem;
}

.display {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  overflow-y: auto;
}
</style>
