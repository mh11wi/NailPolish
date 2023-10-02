<template>
  <div class="container-fluid h-100">
    <div class="row h-100" id="polishGuesser">
      <div class="col-12 mh-100">
        <div class="row mt-3 py-4 justify-content-center">
          <b-input-group class="col-7 col-md-6 col-lg-5 col-xl-4">
            <b-form-input 
              v-model="guess" 
              ref="guessBox"
              aria-label="Enter guess"
              :state="guessState"
              @keyup="resetState" 
              @keyup.enter="makeGuess" 
              :disabled="hasWon || guesses.length == tries"
            />
            <b-input-group-append>
              <b-button 
                variant="primary" 
                @click="makeGuess" 
                :disabled="hasWon || guess.length == 0 || guesses.length == tries"
              >
                Guess
              </b-button>
            </b-input-group-append>
            <b-form-invalid-feedback>
              Please enter a valid polish name.
            </b-form-invalid-feedback>
          </b-input-group>
        </div>
        <Guess 
          v-for="index in tries" 
          :key="index" 
          :correctPolish="correctPolish" 
          :guess="guesses[index - 1]" 
          :index="index"
        />
        <div class="row py-4 justify-content-center">
          <b-button variant="primary" class="mr-3" v-b-modal.rulesModal>How To Play</b-button>
          <b-button id="newButton" variant="primary" class="ml-3" @click="newGame">New Game</b-button>
        </div>
      </div>
    </div>
    <b-modal centered id="rulesModal" title="How To Play" :hide-footer=true title-tag="h2" :scrollable=true size="lg">
      <div class="row pb-3 text-center justify-content-center">
        A random polish has been selected. Try to guess the polish by name in {{ tries }} tries!<br>
        Each guess must be a valid polish in my collection, but excluding toppers and top coats.<br>
        You are shown if your guess is correct or has the right brand, type, colour, and number of coats.<br>
      </div>
      <div class="row examples">
        <div class="col-12">
          <div class="row py-2 text-center justify-content-center">
            <strong>Examples</strong>
          </div>
          <Guess :correctPolish="exampleCorrectPolish" :guess="exampleGuesses[0]" index="ex1"/>
          <div class="row py-1 text-center justify-content-center">
            <div class="col-12">
              <strong>{{ exampleGuesses[0][0].name }}</strong> does not have any of the same properties as the correct polish.
            </div>
          </div>
          <Guess :correctPolish="exampleCorrectPolish" :guess="exampleGuesses[1]" index="ex2"/>
          <div class="row py-1 text-center justify-content-center">
            <div class="col-12">
              <strong>{{ exampleGuesses[1][0].name }}</strong> has the same brand, colour, and number of coats as the correct polish.
          </div>
          </div>
          <Guess :correctPolish="exampleCorrectPolish" :guess="exampleGuesses[2]" index="ex3"/>
          <div class="row py-1 text-center justify-content-center">
            <div class="col-12">
              <strong>{{ exampleGuesses[2][0].name }}</strong>  is the correct polish!
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      centered
      id="gameModal" 
      v-if="Object.keys(this.correctPolish).length > 0" 
      :title="hasWon ? 'You got it!' : 'Sorry! You are out of guesses.'" 
      :hide-footer=true
      title-tag="h2"
      body-class="d-flex"
    >
      <b-row class="flex-grow-1 align-items-center">
        <b-col cols="5">
          <b-img-lazy
            :src="getCorrectPolishImage()" 
            :alt="correctPolish.name" 
            fluid
            blank-color="black"
          />
        </b-col>
        <b-col cols="7" class="h-100 row justify-content-between pr-0">
            <div>The correct polish was...</div>
            <table class="w-100">
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
                <tr v-if="correctPolish.collection != ''">
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
                  <td><strong>Details:</strong></td>
                  <td class="line-height-small">{{ correctPolish.color }}</td>
                </tr>
                <tr>
                  <td><strong>Coats:</strong></td>
                  <td>{{ correctPolish.numCoats }}</td>
                </tr>
              </tbody>
            </table>
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
      guessState: null, // the state of the guess textbox
      exampleCorrectPolishId: 32, // the id of the correct polish in the 'How To Play' modal
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
    },
    
    /** The correct polish in the 'How To Play' modal. */
    exampleCorrectPolish: function() {
      return this.allPolishes[this.exampleCorrectPolishId - 1];
    },
    
    /** The guesses to show in the 'How To Play' modal. */
    exampleGuesses: function() {
      const exampleIds = [176, 69, this.exampleCorrectPolishId];
      const examples = new Array(exampleIds.length);
      for (let i=0; i < exampleIds.length; i++) {
        examples[i] = this.allPolishes.filter(polish => polish.id == exampleIds[i]);
      }
      return examples;
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
    
    /** Resets the state of the guess textbox. */
    resetState() {
      this.guessState = null;
    },
    
    /** Validates the entered guess and updates the game if it's ok. */
    makeGuess() {
      // make sure that there is a polish in the list with the name
      const guess = this.guess.trim().toLowerCase().replace(/[\u2018\u2019]/g, "'");
      const matchingPolishes = this.polishes.filter(polish => polish.name.toLowerCase() === guess);
      if (matchingPolishes.length == 0) {
        this.guessState = false;
        this.$refs.guessBox.focus();
        return;
      }      
      
      // reset the guess box if accepted
      this.guess = '';
      
      // submit the guess and check if won
      this.$nextTick(() => {
        this.guesses.push(matchingPolishes);
        this.hasWon = matchingPolishes[0].name == this.correctPolish.name;
        
        if (this.hasWon || this.guesses.length == this.tries) {
          this.$root.$emit('bv::show::modal', 'gameModal', '#newButton')
        } else {
          this.$refs.guessBox.focus();
        }
      });
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
  .examples {
    border-top: solid 1px #dee2e6;
  }
  
  td {
    vertical-align: baseline;
  }
  
  .line-height-small {
    line-height: 1.2;
  }
</style>
