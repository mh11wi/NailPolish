<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-12 col-sm-4 toppersColumn mh-100">
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
      <div class="col-12 col-sm-8 display mh-100">
        <div v-if="combination.basePolishId == null">
          Start by selecting an applicable base polish from the <strong>Browse Collection</strong> view or from the drop-down menu to the left.
        </div>
        <div v-else class="container-fluid combo">
          <b-img 
            :src="getImage()" 
            :alt="getAlt()" 
            :blank-color="placeholderColor" 
		    @error="handleImageError"
		    fluidGrow
          />
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
      options.push({text: self.polishes[import.meta.env.VITE_GLOSSY - 1].name, value: import.meta.env.VITE_GLOSSY});
	  if (this.showFinishToggle || self.toppersMap[self.combination.basePolishId].includes(import.meta.env.VITE_MATTE)) {
        options.push({text: self.polishes[import.meta.env.VITE_MATTE - 1].name, value: import.meta.env.VITE_MATTE});
	  }
      
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
      const topperId = this.collectionBasePolish.finish == 'glossy' ? import.meta.env.VITE_GLOSSY : import.meta.env.VITE_MATTE;
      this.combination = {basePolishId: this.collectionBasePolish.id, topperId: topperId};
    }
  },
  methods: {
    /** Updates the displayed combination when the selected base polish is changed. */
    updateBasePolish(value) {
      this.combination = {basePolishId: value, topperId: import.meta.env.VITE_GLOSSY};
    },
    
    /** Updates the displayed combination when the selected topper is changed. */
    updateTopper(value) {
      this.combination.topperId = value;
    },
  
    /** Gets the image of the selected base polish and topper combination. */
    getImage() {
	  return new URL(`../assets/images/polishes/${this.combination.basePolishId}/${this.combination.topperId}${import.meta.env.VITE_EXTENSION}`, import.meta.url).href;
    },
    
    /** Gets the alt text of the selected base polish and topper combination. */
    getAlt () {
      const basePolishName = this.polishes[this.combination.basePolishId - 1].name;
      const topperName = this.polishes[this.combination.topperId - 1].name;
      return basePolishName + " + " + topperName;
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

@media (max-width: 576px) {
  .row:has(.toppersColumn) {
    align-content: start;
  }
}

.toppersColumn :deep(.custom-control) {
  padding-bottom: 0.75rem;
}

.display {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  overflow-y: auto;
}

@media (max-width: 576px) {
  .display, .display .container-fluid {
    padding-top: 1rem;
  }
  
  .toppersColumn {
    padding-bottom: 1rem;
  }
}

.combo {
  width: 85%
}

@media (orientation: landscape) and (height < 576px) {
  .combo {
    width: 85vmin;
  }
}

@media (orientation: landscape) and (min-height: 576px) {
  .combo {
    width: 65vmin;
  }
}
</style>
