<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-4 toppersColumn mh-100">
        <b-form-select v-model="selectedBasePolishId" :options="bases" class="mb-2"></b-form-select>
        <b-form-radio-group v-model="selectedTopperId" :options="toppers" class="mt-2" stacked/>
      </div>
      <div class="col-8 display mh-100">
        <div v-if="selectedBasePolishId == null">
          Start by selecting an applicable base polish from the <strong>Browse Collection</strong> view or from the drop-down menu to the left.
        </div>
        <div v-else>
          <div class="row justify-content-center">
            <b-img-lazy 
              :src="getImage(selectedBasePolishId)" 
              :alt="polishes[selectedBasePolishId - 1].name" 
              width=400
              height=400
              blank-color="black"
            >
            </b-img-lazy>
          </div>
          <div class="mt-2 row justify-content-center"><strong>{{ polishes[selectedBasePolishId - 1].brand }}</strong></div>
          <div class="row justify-content-center">{{ polishes[selectedBasePolishId - 1].name }}</div>
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
    'basePolishId', // the base polish selected from the 'Browse Collection' tab to display toppers over
    'defaultTopperId' // which topper should be first selected (including glossy and matte top coat)
  ],
  data: function() {
    return {
      selectedTopperId: '', // the topper to display over the selected base polish
      selectedBasePolishId: null // the base polish to display
    }
  },
  computed: {
    /** Gets the toppers associated to the base polish. */
    toppers: function() {
      const topperIds = [process.env.VUE_APP_GLOSSY, process.env.VUE_APP_MATTE];
      if (this.selectedBasePolishId != null && this.toppersMap[this.selectedBasePolishId] != null) {
        topperIds.push(...this.toppersMap[this.selectedBasePolishId]);
      }
      
      const options = [];
      const self = this;
      topperIds.forEach(function(id) {
        const topper = self.polishes[id - 1];
        const optionHtml = topper.brand != '' ? "<strong>" + topper.brand + "</strong> - " + topper.name : topper.name;
        const disabled = self.selectedBasePolishId == null;
        options.push({html: optionHtml, value: topper.id, disabled: disabled});
      });
      return options;
    },
    
    /** Gets the applicable base polishses. */
    bases: function() {
      const options = [];
      const self = this;
      
      options.push({text: 'Select a base polish', value: null, disabled: true});
      
      const brands = this.pluck(this.polishes, 'brand');
      brands.forEach(function(brand) {
        const brandPolishes = self.polishes.filter(polish => polish.brand == brand);
        const brandPolishesIds = self.pluck(brandPolishes, 'id');
        
        const brandOptions = [];
        Object.keys(self.toppersMap).forEach(function(id) {
          if (brandPolishesIds.includes(id)) {
            brandOptions.push({text: self.polishes[id - 1].name, value: id});
          }
        });
        
        if (brandOptions.length > 0) {
          options.push({label: brand, options: brandOptions});
        }
      });
      
      return options;
    }
  },
  watch: {
    /** Updates the selected topper to the default when the selected base polish changes. */
    selectedBasePolishId: function() {
      this.selectedTopperId = this.defaultTopperId;
    },
    
    /** Updates the selected base polish when a new polish is selected from the 'Browse Collection' tab. */
    basePolishId: function() {
      this.selectedBasePolishId = this.basePolishId;
    },
    
    /** Updates the selected topper when the default topper changes. */
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
      return require('@/assets/images/polishes/' + polishId + '/' + this.selectedTopperId + process.env.VUE_APP_EXTENSION);
    },
    
    /**
     * Plucks distinct items from an array satisfying the given key, and then sorts the set.
     * @param array - an array of items
     * @param key - the key to check
     */
    pluck: function(array, key) {
      return [...new Set(array.map(o => o[key]))].sort();
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
