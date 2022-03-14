<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-12 mh-100">
        <div class="row mt-3 text-center justify-content-center">
          A random polish has been selected. Try to guess the polish by name in {{ tries }} tries!<br>
          Each guess must be a valid polish in my collection, excluding toppers and top coats.<br>
          You will be informed if your guess had the right brand, type, colour, number of coats, and collection set.
        </div>
        <div class="row py-4 justify-content-center">
          <div class="col-4 pl-0 offset-sm-2">
            <b-input-group>
              <b-form-input v-model="guess" ref="guessBox" @keyup.enter="makeGuess" :disabled="hasWon || guesses.length == tries"/>
              <b-input-group-append>
                <b-button variant="primary" @click="makeGuess" :disabled="hasWon || guess.length == 0 || guesses.length == tries">Guess</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="col-3"><b-button id="newButton" variant="primary" @click="newGame">New Game</b-button></div>
        </div>
        <Guess v-for="index in tries" :key="index" :correctPolish="correctPolish" :guess="guesses[index - 1]" :index="index"/>
      </div>
    </div>
    <b-modal id="gameModal" v-if="Object.keys(this.correctPolish).length > 0" :title="hasWon ? 'You got it!' : 'Sorry! You are out of guesses.'" :hide-footer=true>
      <b-row style="height: 300px">
        <b-col cols="5">
          <b-img-lazy
            :src="getCorrectPolishImage()" 
            :alt="correctPolish.name" 
            width=300 
            blank-color="black"
          >
          </b-img-lazy>
        </b-col>
        <b-col cols="7">
            <div class="mb-3">The correct polish was...</div>
            <table class="mb-3 w-100">
              <colgroup>
                <col span="1" style="width:25%">
                <col span="1" style="width:75%">
              </colgroup>
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{{ correctPolish.name }}</td>
                </tr>
                <tr>
                  <td><strong>Brand:</strong></td>
                  <td>{{ correctPolish.brand }}</td>
                </tr>
                <tr>
                  <td><strong>Collection:</strong></td>
                  <td>{{ correctPolish.collection }}</td>
                </tr>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>{{ correctPolish.type }}</td>
                </tr>
                <tr>
                  <td><strong>Colour:</strong></td>
                  <td>{{ correctPolish.colorFamily }}</td>
                </tr>
                <tr>
                  <td><strong>Coats:</strong></td>
                  <td>{{ correctPolish.numCoats }}</td>
                </tr>
              </tbody>
            </table>
            <div>You can try another by clicking <strong>New Game</strong> outside of this dialog.</div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import Guess from './Guess.vue'

/** The 'Polish Guesser' tab, where one can guess the randomly chosen polish. */
export default {
  name: 'Guesser',
  components: {
    Guess
  },
  props: [
    'allPolishes', // data of all polishes (including toppers, which will be extracted)
  ],
  data: function() {
    return {
      tries: 6, // the number of tries you get to guess the polish
      correctPolish: {}, // the polish to guess
      guesses: [], // the polishes guessed each try
      guess: '', // the guess typed in the textbox
      hasWon: false, // whether the polish was correctly guessed
    }
  },
  /** Loads an initial game. */
  mounted: function() {
    this.newGame();
  },
  computed: {
    /** Initially extract all toppers from the list of polishes. */
    polishes: function() {
      return this.allPolishes.filter(polish => polish.type != 'Topper').sort((a, b) => b.id - a.id);
    }
  },
  methods: {
    /** Resets data and starts a new game. */
    newGame() {
      this.hasWon = false;
      this.guesses = [];
      this.guess = '';
      this.chooseRandomPolish();
    },
  
    /** Picks a random polish from the list (excluding toppers). */
    chooseRandomPolish() {
      const min = parseInt(process.env.VUE_APP_MATTE) + 1;
      const max = this.polishes.length - 1;
      const id = Math.floor(Math.random() * (max - min) ) + min;
      this.correctPolish = this.polishes[id];
    },
    
    /** Validates the entered guess and updates the game if it's ok. */
    makeGuess() {
      // make sure that there is a polish in the list with the name
      const guess = this.guess.trim().toLowerCase();
      const matchingPolishes = this.polishes.filter(polish => polish.name.toLowerCase() === guess);
      if (matchingPolishes.length == 0) {
        return;
      }      
      
      // submit the guess
      this.guesses.push(matchingPolishes);
      this.guess = '';
      
      // check if won
      this.hasWon = matchingPolishes[0].name == this.correctPolish.name;
      
      if (this.hasWon || this.guesses.length == this.tries) {
        this.$root.$emit('bv::show::modal', 'gameModal', '#newButton')
      } else {
        this.$refs.guessBox.focus();
      }
    },
    
    /** Gets the image of the correct polish. */
    getCorrectPolishImage() {
      return require('@/assets/images/polishes/' + this.correctPolish.id + '/' + process.env.VUE_APP_GLOSSY + process.env.VUE_APP_EXTENSION);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
