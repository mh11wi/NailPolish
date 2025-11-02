<template>
  <div class="comparison mb-5 w-100">
    <div class="container-fluid">
	  <div class="row">
        <div class="d-flex flex-grow-1 align-items-center pl-3 pl-sm-4">
          <strong v-if="!editMode">{{ comparison.name }}</strong>
          <b-form-input type="search" ref="editName" v-model="name" :maxLength="maxNameLength" v-else @blur="finishEdit" @keyup.enter="finishEdit"/>
          <b-button variant="link" class="ml-1 ml-sm-3" v-if="!editMode" @click="editMode = true" aria-label="Edit comparison name">
            <font-awesome-icon icon="pencil-alt" size="lg"/>
          </b-button>
          <b-button variant="link" v-if="!editMode" @click="deleteComparison" aria-label="Delete comparison">
            <font-awesome-icon icon="trash-alt" size="lg"/>
          </b-button>
        </div>
        <div v-if="comparison.polishes.length != 0" class="d-flex justify-content-end align-items-center pr-3 pr-sm-3">
          <b-form-checkbox 
            v-if="containsTwoState" 
            switch 
            v-model="effectChecked" 
            size="lg" 
            aria-label="State for 'Solar' and 'Glow in the Dark' polishes"
          >
            <div :class="{'hide-xs': showFinishToggle}">
              <font-awesome-icon icon="sun" size="sm" />
              /
              <font-awesome-icon icon="moon" size="sm" />
			</div>
          </b-form-checkbox>
          <FinishToggle class="ml-2 ml-sm-4" v-model="finish" @updateFinish="finish = $event"/>
        </div>
	  </div>
    </div>
    <div v-if="comparison.polishes.length == 0" class="container-fluid mt-2">Please add polishes from the <strong>Browse Collection</strong> view to compare.</div>
	<div v-else class="row align-items-center position-relative mt-2 px-3 px-sm-2">
	  <b-button 
		v-if="!hasTouch && slideIndex > 0" 
		variant="link" 
		class="arrow-button arrow-left ml-4 ml-sm-2" 
		@click="prev" 
		aria-label="Previous polishes in comparison"
	  >
		<font-awesome-icon icon="chevron-circle-left"/>
	  </b-button>
	  <b-carousel class="mt-3" ref="comparisonCarousel" v-model="slideIndex" :interval="0" :indicators="numSlides > 1" :no-animation="noAnimation" no-wrap>
		<b-carousel-slide v-for="(slide, index1) in slides" :key="index1">
		  <template v-slot:img>
			<b-row :cols="cardsPerSlide" :align-h="numSlides > 1 ? 'left' : 'center'" class="mx-0">
			  <b-col class="px-2" v-for="(card, index2) in slide" :key="card.polish.id">
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
	  <b-button 
		v-if="!hasTouch && slideIndex < numSlides - 1" 
		variant="link" 
		class="arrow-button arrow-right mr-4 mr-sm-2" 
		@click="next" 
		aria-label="Next polishes in comparison"
	  >
		<font-awesome-icon icon="chevron-circle-right"/>
	  </b-button>
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
      slideIndex: 0, // the index of the current slide shown
	  noAnimation: false // whether carousel animations should be prevented
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
	  this.noAnimation = true;
	  this.slideIndex = 0;
	  this.$nextTick(() => {
        this.noAnimation = false;
      });
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
        this.noAnimation = true;
	    this.slideIndex--;
	    this.$nextTick(() => {
          this.noAnimation = false;
        });
      }
      this.comparison.polishes.splice(event, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comparison :deep(input[type="search"]) {
  width: 50%;
}

@media (width < 576px) {
  .comparison :deep(input[type="search"]) {
    width: 75%;
  }
  
  .comparison :deep(.btn-link) {
    padding: 0.5rem;
  }
}

.comparison :deep(.custom-control-label) {
  color: var(--warning);
  opacity: 0.65;
}

.comparison :deep(.custom-control-input:checked ~ .custom-control-label::before) {
  border-color: var(--warning);
  background-color: var(--warning);
}

.comparison :deep(.carousel-indicators) {
  bottom: -3.5rem;
  z-index: 1;
}

/* Styling individual indicators (the default <li> elements) */
.comparison :deep(.carousel-indicators li) {
  background-color: var(--secondary);
  border-radius: 50%;
  width: 0.6rem;
  height: 0.6rem;
  margin: 0 0.2rem;
  opacity: 0.6;
}

/* Styling the active indicator */
.comparison :deep(.carousel-indicators li.active) {
  background-color: var(--dark);
  opacity: 0.9;
}

.comparison :deep(.position-absolute) {
  left: 0 !important;
  top: 0 !important;
  transform: none !important;
  width: 100%;
  margin-top: -0.25rem;
}

.arrow-button {
  position: absolute;
  z-index: 11;
  margin-top: -15px;
  font-size: 2.5rem;
  opacity: 0.4;
}

.arrow-button:hover {
  opacity: 0.6;
}

.arrow-button:focus {
  box-shadow: none;
}

.arrow-left {
  left: 0;
}

.arrow-right {
  right: 0;
}
</style>
