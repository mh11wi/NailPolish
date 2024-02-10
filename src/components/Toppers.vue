<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-4 toppersColumn mh-100">
        <div>
          <label class="font-weight-bold">Base polish:</label>
          <b-form-select 
            :value="combination.basePolishId" 
            aria-label="Select a base polish" 
            :options="bases" 
            @change="updateBasePolish" 
          />
        </div>
        <div v-if="combination.basePolishId" class="mt-4">
          <label class="font-weight-bold">Topper:</label>
          <b-form-select 
            :value="combination.topperId" 
            aria-label="Select a topper" 
            :options="toppers" 
            @change="updateTopper" 
          />
        </div>
      </div>
      <div class="col-8 display mh-100">
        <div v-if="combination.basePolishId == null">
          Start by selecting an applicable base polish from the <strong>Browse Collection</strong> view or from the drop-down menu to the left.
        </div>
        <div v-else>
          <div class="container-fluid combo">
            <b-img-lazy 
              :src="getImage()" 
              :alt="getAlt()" 
              fluid
              blank-color="black"
            />
          </div>
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
    'collectionBasePolish' // the base polish selected from the 'Browse Collection' tab to display toppers over
  ],
  data: function() {
    return {
      combination: {basePolishId: null, topperId: null} // the current combination of base polish and topper
    }
  },
  computed: {
    /** Gets the toppers associated to the selected base polish. */
    toppers: function() {
      const options = [];
      const self = this;
      
      options.push({text: 'Select a topper', value: null, disabled: true});
      options.push({text: self.polishes[process.env.VUE_APP_GLOSSY - 1].name, value: process.env.VUE_APP_GLOSSY});
      options.push({text: self.polishes[process.env.VUE_APP_MATTE - 1].name, value: process.env.VUE_APP_MATTE});
      
      const brands = this.pluck(this.polishes, 'brand');
      brands.forEach(function(brand) {
        const brandPolishes = self.polishes.filter(polish => polish.brand == brand);
        const brandPolishesIds = self.pluck(brandPolishes, 'id');
        
        const brandOptions = [];
        self.toppersMap[self.combination.basePolishId].forEach(function(id) {
          if (brandPolishesIds.includes(id)) {
            brandOptions.push({text: self.polishes[id - 1].name, value: id});
          }
        });
        
        if (brandOptions.length > 0) {
          options.push({label: brand, options: brandOptions});
        }
      });
      
      return options;
    },
    
    /** Gets the applicable base polishes. */
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
    /** Updates the displayed combination when a base polish is selected from the 'Browse Collection' tab. */
    collectionBasePolish: function() {
      const topperId = this.collectionBasePolish.finish == 'glossy' ? process.env.VUE_APP_GLOSSY : process.env.VUE_APP_MATTE;
      this.combination = {basePolishId: this.collectionBasePolish.id, topperId: topperId};
    }
  },
  methods: {
    /** Updates the displayed combination when the selected base polish is changed. */
    updateBasePolish(value) {
      this.combination = {basePolishId: value, topperId: process.env.VUE_APP_GLOSSY};
    },
    
    /** Updates the displayed combination when the selected topper is changed. */
    updateTopper(value) {
      this.combination.topperId = value;
    },
  
    /** Gets the image of the selected base polish and topper combination. */
    getImage() {
      return require('@/assets/images/polishes/' + this.combination.basePolishId + '/' + this.combination.topperId + process.env.VUE_APP_EXTENSION);
    },
    
    /** Gets the alt text of the selected base polish and topper combination. */
    getAlt () {
      const basePolishName = this.polishes[this.combination.basePolishId - 1].name;
      const topperName = this.polishes[this.combination.topperId - 1].name;
      return basePolishName + " + " + topperName;
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

@media (orientation: portrait) {
  .combo {
    width: 55vmin;
  }
}

@media (orientation: landscape) {
  .combo {
    width: 65vmin;
  }
}
</style>
