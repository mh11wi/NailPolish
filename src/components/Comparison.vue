<template>
  <div class="container-fluid mb-4 mb-sm-5 comparison">
    <div class="row align-items-center">
      <div class="col-7 px-0">
        <div class="ml-3 ml-sm-4">
          <strong v-if="!editMode" class="comparisonName h-100">{{ comparison.name }}</strong>
          <b-form-input type="search" ref="editName" v-model="name" :maxLength="maxNameLength" v-else @blur="finishEdit" @keyup.enter="finishEdit"/>
          <b-button variant="link" class="ml-1 ml-sm-3" v-if="!editMode" @click="editMode = true" aria-label="Edit comparison name">
            <font-awesome-icon icon="pencil-alt" size="lg"/>
          </b-button>
          <b-button variant="link" v-if="!editMode" @click="deleteComparison" aria-label="Delete comparison">
            <font-awesome-icon icon="trash-alt" size="lg"/>
          </b-button>
        </div>
      </div>
      <div class="col-5 px-0 text-right">
        <div v-if="comparison.polishes.length != 0" class="mr-3 mr-sm-4">
          <b-form-checkbox 
            v-if="containsTwoState" 
            switch 
            v-model="effectChecked" 
            size="lg" 
            class="mr-2 mr-sm-4"
            aria-label="State for 'Solar' and 'Glow in the Dark' polishes"
          >
            <div class="two-state hide-xs">
              <font-awesome-icon icon="sun" class="text-warning"/>
              /
              <font-awesome-icon icon="moon" class="text-warning"/>
			</div>
          </b-form-checkbox>
          <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="container-fluid">
        <span v-if="comparison.polishes.length == 0" class="ml-2">Please add polishes from the <strong>Browse Collection</strong> view to compare.</span>
        <div v-else class="row align-items-center">
          <div class="col-1 px-2 px-md-3">
            <b-button 
              v-if="slideIndex > 0" 
              variant="link" 
              class="arrow-button" 
              @click="prev" 
              aria-label="Previous polishes in comparison"
            >
              <font-awesome-icon icon="chevron-circle-left" size="2x"/>
            </b-button>
          </div>
          <div class="col-10 px-0 px-md-2">
            <b-carousel class="mt-3" ref="comparisonCarousel" :controls="false" :interval="0" @sliding-end="slidingEnd" no-wrap>
              <b-carousel-slide v-for="(slide, index1) in slides" :key="index1">
                <template v-slot:img>
                  <b-row align-h="center" class="mx-0">
                    <b-col :cols="12 / cardsPerSlide" class="px-1 px-sm-2 px-md-3" v-for="(card, index2) in slide" :key="card.polish.id">
                      <ComparisonPolish 
                        :card="card" 
                        :index="cardsPerSlide * index1 + index2" 
                        :finish="finish" 
                        :comparisonLength="comparison.polishes.length"
                        :isEffect="effectChecked"
                        @movePolish="movePolish"
                        @removePolish="removePolish"
                      />
                    </b-col>
                  </b-row>
                </template>
              </b-carousel-slide>
            </b-carousel>
          </div>
          <div class="col-1 px-2 px-md-3 text-right">
            <b-button 
              v-if="slideIndex < numSlides - 1" 
              variant="link" 
              class="arrow-button" 
              @click="next" 
              aria-label="Next polishes in comparison"
            >
              <font-awesome-icon icon="chevron-circle-right" size="2x"/>
            </b-button>
          </div>
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
    'cardsPerSlide' // the number of polish cards to show on a carousel slide
  ],
  data: function() {
    return {
      editMode: false, // whether the comparison's name is being edited
      finish: 'glossy', // the selected polish finish to display (either 'glossy' or 'matte)
      maxNameLength: 18, // the maximum number of characters allowed for a comparison's name
      effectChecked: false, // whether the effect toggle is checked or not (when a comparison contains a solar or glow in the dark polish)
      name: this.comparison.name, // the name being edited when editMode is true, and copied to the comparison prop when finished (for performance)
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
    },
    
    /** Reset slides when number of cards per slides changes. */
    cardsPerSlide: function() {
      this.slideIndex = 0;
      this.$refs.comparisonCarousel.setSlide(0);
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
    
    /** Handle when the slide is changed. */
    slidingEnd(slide) {
      this.slideIndex = slide;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comparison >>> input[type="search"] {
  width: 50%;
}

.arrow-button {
  padding: 0;
}

@media (width < 576px) {
  .comparison >>> input[type="search"] {
    width: 75%;
  }
  
  .arrow-button {
    font-size: 12px;
  }
}

.comparison >>> .custom-control-input:checked ~ .custom-control-label::before {
  border-color: var(--warning);
  background-color: var(--warning);
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

.two-state {
  color: var(--warning);
  font-size: 0.85rem;
  padding: 0.3rem 0;
  opacity: 0.65;
}
</style>
