<template>
  <div class="row py-3 justify-content-center">
    <div class="col-3 guessMade">{{ displayGuess }}</div>
    <button class="square" :id="'brandCorrect-' + index" :disabled="!isBrandCorrect">
      <font-awesome-icon :id="'brandCorrect-' + index" v-if="isBrandCorrect" icon="store" size="xl"/>
    </button>
    <b-tooltip :target="'brandCorrect-' + index" triggers="hover focus">Brand correct</b-tooltip>

    <button class="square" :id="'typeCorrect-' + index" :disabled="!isTypeCorrect">
      <font-awesome-icon v-if="isTypeCorrect" icon="hand-sparkles" size="xl"/>
    </button>
    <b-tooltip :target="'typeCorrect-' + index">Type correct</b-tooltip>

    <button class="square" :id="'colorCorrect-' + index" :disabled="!isColorCorrect">
      <font-awesome-icon v-if="isColorCorrect" icon="palette" size="xl"/>
    </button>
    <b-tooltip :target="'colorCorrect-' + index">Colour correct</b-tooltip>

    <button class="square" :id="'coatsCorrect-' + index" :disabled="!isCoatsCorrect">
      <font-awesome-icon v-if="isCoatsCorrect" icon="paint-brush" size="xl"/>
    </button>
    <b-tooltip :target="'coatsCorrect-' + index">Number of coats correct</b-tooltip>

    <button class="square" :id="'polishCorrect-' + index" :disabled="!isPolishCorrect">
      <font-awesome-icon v-if="isPolishCorrect" icon="flask" size="xl"/>
    </button>
    <b-tooltip :target="'polishCorrect-' + index">Polish correct</b-tooltip>
  </div>
</template>

<script>
/** A guess in the Polish Guesser game. */
export default {
  name: 'Guess',
  props: [
    'correctPolish', // the polish to compare to
    'guess', // the polish(es) guessed, could be multiple if same name
    'index' // the index of the guess
  ],
  computed: {
    /** The polish name to display as the guess. */
    displayGuess: function() {
      return this.guess ? this.guess[0].name : '';
    },
  
    /** Whether the guessed polish has the right brand. */
    isBrandCorrect: function() {
      return this.guess && this.guess.filter(polish => polish.brand == this.correctPolish.brand).length > 0;
    },

    /** Whether the guessed polish has the right type. */ 
    isTypeCorrect: function() {
      return this.guess && this.guess.filter(polish => polish.type == this.correctPolish.type).length > 0;
    },
    
    /** Whether the guessed polish has the right colour. */
    isColorCorrect: function() {
      return this.guess && this.guess.filter(polish => polish.colorFamily == this.correctPolish.colorFamily).length > 0;
    },
    
    /** Whether the guessed polish has the right number of coats. */
    isCoatsCorrect: function() {
      return this.guess && this.guess.filter(polish => polish.numCoats == this.correctPolish.numCoats).length > 0;
    },
    
    /** Whether the guessed polish is correct. */
    isPolishCorrect: function() {
      return this.guess && this.guess.filter(polish => polish.name == this.correctPolish.name).length > 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .guessMade {
    border: 1px solid black;
    margin: 0 0.5rem;
    padding: 0.33rem 0.5rem;
  }

  .square {
    background-color: white;
    color: black;
    border: 1px solid black;
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 0.5rem;
    padding: 0.33rem 0;
    text-align: center;
  }
</style>
