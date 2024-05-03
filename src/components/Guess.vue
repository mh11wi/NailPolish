<template>
  <div class="row py-3 justify-content-center">
    <div class="col-5 col-sm-4 col-xl-3 guessMade">{{ displayGuess }}</div>
    <button class="square" :id="'brandCorrect-' + index" :disabled="!isBrandCorrect" :aria-label="getBrandLabel()">
      <font-awesome-icon v-if="isBrandCorrect" icon="store" size="xl"/>
    </button>
    <b-tooltip :target="'brandCorrect-' + index" container="polishGuesser">{{ getBrandLabel() }}</b-tooltip>

    <button class="square" :id="'typeCorrect-' + index" :disabled="!isTypeCorrect" :aria-label="getTypeLabel()">
      <font-awesome-icon v-if="isTypeCorrect" icon="hand-sparkles" size="xl"/>
    </button>
    <b-tooltip :target="'typeCorrect-' + index" container="polishGuesser">{{ getTypeLabel() }}</b-tooltip>

    <button class="square" :id="'colorCorrect-' + index" :disabled="!isColorCorrect" :aria-label="getColorLabel()">
      <font-awesome-icon v-if="isColorCorrect" icon="palette" size="xl"/>
    </button>
    <b-tooltip :target="'colorCorrect-' + index" container="polishGuesser">{{ getColorLabel() }}</b-tooltip>

    <button class="square" :id="'coatsCorrect-' + index" :disabled="!isCoatsCorrect" :aria-label="getCoatsLabel()">
      <font-awesome-icon v-if="isCoatsCorrect" icon="paint-brush" size="xl"/>
    </button>
    <b-tooltip :target="'coatsCorrect-' + index" container="polishGuesser">{{ getCoatsLabel() }}</b-tooltip>

    <button class="square" :id="'polishCorrect-' + index" :disabled="!isPolishCorrect" :aria-label="getPolishLabel()">
      <font-awesome-icon v-if="isPolishCorrect" icon="flask" size="xl"/>
    </button>
    <b-tooltip :target="'polishCorrect-' + index" container="polishGuesser">{{ getPolishLabel() }}</b-tooltip>
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
  },
  methods: {
    /** Gets the label for the brand box. */
    getBrandLabel() {
      if (!this.guess) {
        return "Enter a guess to see whether the brand is correct";
      }
      
      return `Brand ${this.isBrandCorrect ? 'correct' : 'incorrect'}`;
    },
    
    /** Gets the label for the type box. */
    getTypeLabel() {
      if (!this.guess) {
        return "Enter a guess to see whether the type is correct";
      }
      
      return `Type ${this.isTypeCorrect ? 'correct' : 'incorrect'}`;
    },
    
    /** Gets the label for the colour box. */
    getColorLabel() {
      if (!this.guess) {
        return "Enter a guess to see whether the colour is correct";
      }
      
      return `Colour ${this.isColorCorrect ? 'correct' : 'incorrect'}`;
    },
    
    /** Gets the label for the coats box. */
    getCoatsLabel() {
      if (!this.guess) {
        return "Enter a guess to see whether the number of coats is correct";
      }
      
      return `Number of coats ${this.isCoatsCorrect ? 'correct' : 'incorrect'}`;
    },
    
    /** Gets the label for the polish box. */
    getPolishLabel() {
      if (!this.guess) {
        return "Enter a guess to see whether the polish is correct";
      }
      
      return `Polish ${this.isPolishCorrect ? 'correct' : 'incorrect'}`;
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
