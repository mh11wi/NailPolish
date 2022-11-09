<template>
  <div class="container-fluid mb-5 comparison">
    <div class="row align-items-center">
      <div class="col-6 pl-0">
        <div class="ml-5">
          <strong v-if="!editMode" class="comparisonName h-100">{{ comparison.name }}</strong>
          <b-form-input ref="editName" v-model="name" :maxLength="maxNameLength" v-else @blur="finishEdit" @keyup.enter="finishEdit"/>
          <b-button variant="link" class="ml-3" v-if="!editMode" @click="editMode = true" aria-label="Edit comparison name">
            <font-awesome-icon icon="pencil-alt" size="lg"/>
          </b-button>
          <b-button variant="link" v-if="!editMode" @click="deleteComparison" aria-label="Delete comparison">
            <font-awesome-icon icon="trash-alt" size="lg"/>
          </b-button>
        </div>
      </div>
      <div class="col-6 pr-0 text-right">
        <div v-if="comparison.polishes.length != 0" class="mr-5">
          <b-form-checkbox 
            v-if="containsTwoState" 
            switch 
            v-model="effectChecked" 
            size="lg" 
            class="mr-4" 
            aria-label="State for 'Solar' and 'Glow in the Dark' polishes"
          >
            <font-awesome-icon icon="sun" class="text-warning" size="lg"/>
            /
            <font-awesome-icon icon="moon" class="text-warning"/>
          </b-form-checkbox>
          <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <span v-if="comparison.polishes.length == 0" class="ml-5">Please add polishes from the <strong>Browse Collection</strong> view to compare.</span>
      <div v-else class="row align-items-center w-100">
        <div class="col-1">
          <b-button v-if="slideIndex > 0" variant="link" @click="prev" aria-label="Previous polishes in comparison">
            <font-awesome-icon icon="chevron-circle-left" size="2x"/>
          </b-button>
        </div>
        <div class="col-10">
          <b-carousel class="mt-3" ref="comparisonCarousel" :controls="false" :interval="0" @sliding-end="slidingEnd" no-wrap>
            <b-carousel-slide v-for="(slide, index1) in slides" :key="index1">
              <template v-slot:img>
                <b-row align-h="center">
                  <b-col :cols="12 / cardsPerSlide" v-for="(card, index2) in slide" :key="card.polish.id">
                    <ComparisonPolish 
                      :card="card" 
                      :index="cardsPerSlide * index1 + index2" 
                      :finish="finish" 
                      :comparisonLength="comparison.polishes.length"
                      :cardHeight="cardHeight"
                      :isEffect="effectChecked"
                      @resize="handleResize"
                      @movePolish="movePolish"
                      @removePolish="removePolish"
                    >
                    </ComparisonPolish>
                  </b-col>
                </b-row>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </div>
        <div class="col-1 text-right">
          <b-button v-if="slideIndex < numSlides - 1" variant="link" @click="next" aria-label="Next polishes in comparison">
            <font-awesome-icon icon="chevron-circle-right" size="2x"/>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue';
import ComparisonPolish from './ComparisonPolish.vue';

/** A 'comparison' is a list of polishes to compare next to one another. */
export default {
  name: 'Comparison',
  components: {
    FinishToggle,
    ComparisonPolish
  },
  props: [
    'comparison', // data of the comparison (i.e. list of polishes and name)
    'cardHeight' // the height the Bootstrap card (containing polish info) should be, i.e. same as width, which varies on window size
  ],
  data: function() {
    return {
      editMode: false, // whether the comparison's name is being edited
      finish: 'glossy', // the selected polish finish to display (either 'glossy' or 'matte)
      maxNameLength: 18, // the maximum number of characters allowed for a comparison's name
      effectChecked: false, // whether the effect toggle is checked or not (when a comparison contains a solar or glow in the dark polish)
      name: this.comparison.name, // the name being edited when editMode is true, and copied to the comparison prop when finished (for performance)
      cardsPerSlide: 3, // the number of polish cards to show on a carousel slide
      slideIndex:0 // the index of the current slide shown
    }
  },
  watch: {
    /** Focus the input when in edit mode. */
    editMode: function() {
      if (this.editMode) {
        this.$nextTick(() => {
          this.$refs.editName.focus();
        });
      }
    }
  },
  computed: {
    /** The number of carousel slides needed to display all comparison polishes. */
    numSlides: function() {
      return Math.ceil(this.comparison.polishes.length / this.cardsPerSlide);
    },
  
    /** Arranges the list of polishes to compare in a Bootstrap carousel. */
    slides: function() {
      const output = [];
      let counter = 0;
      for (let i=0; i < this.numSlides; i++) {
        const slide = [];
        for (let j=0; j < this.cardsPerSlide; j++) {
          if (counter < this.comparison.polishes.length) {
            slide.push(this.comparison.polishes[counter]);
            counter++;
          } else {
            break;
          }
        }
        output.push(slide);
      }
      return output;
    },

    /** Check whether the comparison contains a two state polish (solar or glow in the dark), in order to display the toggle. */
    containsTwoState: function() {
      return this.comparison.polishes.some(item => item.polish.type == 'Solar' || item.polish.type == 'Glow in the Dark');
    }
  },
  methods: {
    /** Ensure that the name is saved with a maximum amount of characters, and if empty keep old name. */
    finishEdit() {
      this.editMode = false;
      if ('' == this.name.trim()) {
        this.name = this.comparison.name;
      } else if (this.name.length > this.maxNameLength) {
        this.name = this.name.substring(0, this.maxNameLength);
      }
      
      this.comparison.name = this.name;
    },
    
    /** Handle the deletion of the comparison in the parent component. */
    deleteComparison() {
      this.$emit("deleteComparison", this.$vnode.key);
    },
    
    /** Goes to the previous carousel slide. */
    prev() {
      this.$refs.comparisonCarousel.prev();
    },
    
    /** Goes to the next carousel slide. */
    next() {
      this.$refs.comparisonCarousel.next();
    },
    
    /** 
     * Move a polish left or right in the list of polishes to compare.
     * @param event - object containing polish to move and direction
     */
    movePolish(event) {
      const polishes = [...this.comparison.polishes];
      const tmp = polishes[event.index];
      polishes[event.index] = polishes[event.index + event.dir];
      polishes[event.index + event.dir] = tmp;
      this.comparison.polishes = polishes;
    },

    /**
     * Removes a polish from the list of polishes to compare.
     * @param event - object containing polish to remove
     */
    removePolish(event) {
      if (this.slideIndex > 0 && this.slides[this.slideIndex].length == 1) {
        this.slideIndex--;
      }
      this.comparison.polishes.splice(event, 1);
    },

    /** Handle the resizing of a polish's card in the parent component. */
    handleResize() {
      this.$emit("resize");
    },
    
    /** Handle when the slide is changed. */
    slidingEnd(slide) {
      this.handleResize();
      this.slideIndex = slide;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comparison >>> input[type="text"] {
  width: 50%;
}

.comparison >>> .carousel-caption {
  color: black;
}

.comparison >>> .position-absolute {
  left: 0 !important;
  top: 0 !important;
  transform: none !important;
  width: 100%;
  margin-top: -0.25rem;
}

.comparisonName, .comparison >>> .custom-switch {
  display: inline-block;
  vertical-align: middle;
}
</style>
