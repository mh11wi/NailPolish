<template>
  <div class="polish">
    <b-overlay :show="true" :opacity="0">
      <b-aspect aspect="1:1">
        <b-card v-if="!card.detailsMode" class="border-0" img-top no-body>
          <b-img
		    :src="getImage(card.polish.id)" 
		    :alt="card.polish.name" 
		    :blank-color="placeholderColor" 
		    @error="handleImageError"
		    fluidGrow
		  />
        </b-card>
        <b-card v-else class="pt-5 h-100" no-body>
          <b-card-text class="mx-3 h-100 d-flex flex-column">
            <b-row align-v="center">
              <b-col cols="6">
                <b-img
				  :src="getImage(card.polish.id)" 
				  :alt="card.polish.name" 
				  :blank-color="placeholderColor" 
				  @error="handleImageError"
				  fluidGrow
				/>
              </b-col>
              <b-col cols="6" class="pl-0">
                <p class="mb-1">{{ card.polish.type }}</p>
                <p class="mb-1">{{ card.polish.numCoats }} coat{{ card.polish.numCoats == 1 ? '' : 's'}}</p>
              </b-col>
            </b-row>
            <b-row align-v="center" class="flex-grow-1">
              <b-col>
                <div class="text-center">{{ card.polish.color }}</div>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
      </b-aspect>
      <template #overlay>
        <div class="row align-items-center mt-1 mx-0">
          <div class="col-3 px-0">
            <b-button variant="link" class="text-decoration-none" size="sm" @click="toggleMode">
              <strong v-if="!card.detailsMode">Details</strong>
              <strong v-else>Back</strong>
            </b-button>
          </div>
          <div class="col-6 px-0 text-center">
            <b-button 
              variant="link" 
              class="text-decoration-none px-2" 
              size="lg" 
              @click="movePolish(-1)" 
              :disabled="index == 0" 
              aria-label="Move polish left"
            >
              <font-awesome-icon icon="arrow-left"/>
            </b-button>
            <b-button 
              variant="link" 
              class="text-decoration-none px-2" 
              size="lg" 
              @click="movePolish(1)" 
              :disabled="index == comparisonLength - 1" 
              aria-label="Move polish right"
            >
              <font-awesome-icon icon="arrow-right"/>
            </b-button>
          </div>
          <div class="col-3 px-0 text-right">
            <b-button 
              variant="link" 
              class="text-decoration-none" 
              size="lg" 
              @click="removePolish" 
              aria-label="Remove polish from comparison"
            >
              <font-awesome-icon icon="times"/>
            </b-button>
          </div>
        </div>
      </template>
    </b-overlay>
    <div class="text-center mt-1">
      <strong class="line-height-small">{{ card.polish.brand }}</strong>
      <span class="d-block line-height-small">{{ card.polish.name }}</span>
    </div>
  </div>
</template>

<script>
/** A 'comparison polish' is a polish in a comparison, which is displayed in a Bootstrap card. */
export default {
  name: 'ComparisonPolish',
  props: [
    'card', // the polish information to display in the card
    'index', // the index of the card within the parent component's carousel
    'finish', // the finish of the polish to display (either 'glossy' or 'matte')
    'comparisonLength', // the number of polishes in the comparison
    'isEffect' // if the polish is solar or glow in the dark, whether the sun/dark image should be retrieved
  ],
  methods: {
    /**
     * Gets the specified polish image.
     * @param polishId - the id of the polish
     */
    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? import.meta.env.VITE_GLOSSY : import.meta.env.VITE_MATTE;
      
      let suffix = '';
      if (this.card.polish.type == 'Solar' && this.isEffect) {
        suffix = '-sun';
      } else if (this.card.polish.type == 'Glow in the Dark' && this.isEffect) {
        suffix = '-dark';
      }
      
	  return new URL(`../assets/images/polishes/${polishId}/${finishId}${suffix}${import.meta.env.VITE_EXTENSION}`, import.meta.url).href;
    },

    /**
     * Moves the polish within the comparison in the specified direction. Handled in the parent component.
     * @param dir - the direction to move (either -1 for left, or 1 for right)
     */
    movePolish(dir) {
      this.$emit("movePolish", {index: this.index, dir: dir});
    },

    /** Removes the chosen polish from the comparison. Handled in the parent component. */
    removePolish() {
      this.$emit("removePolish", this.index);
    },

    /** Whether the image or details should be displayed in the card. */
    toggleMode() {
      this.card.detailsMode = !this.card.detailsMode;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.polish :deep(.card-footer) {
  border-left: 1px solid white;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  margin: -1px;
}

@media (max-width: 576px) {
  .polish {
    font-size: 15px;
  }
}

@media (max-width: 360px) {
  .polish {
    font-size: 13px;
  }
}
</style>
