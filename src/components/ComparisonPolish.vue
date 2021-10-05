<template>
  <div class="polish">
    <b-overlay :show="true" :opacity="0">
      <b-card v-if="!card.detailsMode" class="border-0" :img-src="getImage(card.polish.id)" :img-alt="card.polish.name" img-top no-body/>
      <b-card v-else class="pt-5" :style="{ height: cardHeight + 'px' }" no-body>
        <b-card-text class="mx-3 h-100 d-flex flex-column">
          <b-row align-v="center">
            <b-col cols="6">
              <b-img-lazy :src="getImage(card.polish.id)" :alt="card.polish.name" blank-color="black" fluid/>
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
      <template #overlay>
        <div class="row align-items-center mt-1 mx-0">
          <div class="col-3 px-0">
            <b-button variant="link" class="text-decoration-none" size="sm" @click="toggleMode">
              <strong v-if="!card.detailsMode">Details</strong>
              <strong v-else>Back</strong>
            </b-button>
          </div>
          <div class="col-6 px-0 text-center">
            <b-button variant="link" class="text-decoration-none px-2" size="lg" @click="movePolish(-1)" :disabled="index == 0">
              <font-awesome-icon icon="arrow-left"/>
            </b-button>
            <b-button variant="link" class="text-decoration-none px-2" size="lg" @click="movePolish(1)" :disabled="index == comparisonLength - 1">
              <font-awesome-icon icon="arrow-right"/>
            </b-button>
          </div>
          <div class="col-3 px-0 text-right">
            <b-button variant="link" class="text-decoration-none" size="lg" @click="removePolish">
              <font-awesome-icon icon="times"/>
            </b-button>
          </div>
        </div>
      </template>
    </b-overlay>
    <div class="text-center mt-2">
      <strong>{{ card.polish.brand }}</strong>
      <br>{{ card.polish.name }}
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
    'cardHeight', // the height of the card
    'isSun' // if the polish is solar, whether the sun image should be retrieved
  ],
  /** Ensure that the height of the card is correct when switching between image and details in the card. */
  updated() {
    this.$emit("resize");
  },
  methods: {
    /**
     * Gets the specified polish image.
     * @param polishId - the id of the polish
     */
    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? process.env.VUE_APP_GLOSSY : process.env.VUE_APP_MATTE;
      const appendSun = this.card.polish.type == 'Solar' && this.isSun ? '-sun' : '';
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + appendSun + process.env.VUE_APP_EXTENSION);
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
.polish >>> .card-footer {
  border-left: 1px solid white;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  margin: -1px;
}
</style>
