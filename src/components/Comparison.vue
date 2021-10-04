<template>
  <div class="container-fluid mb-5 comparison">
    <div class="row align-items-center">
      <div class="col-6 pl-0">
        <div class="ml-5">
          <strong v-if="!editMode" class="comparisonName h-100">{{ comparison.name }}</strong>
          <b-form-input v-model="comparison.name" autofocus :maxLength="maxNameLength" v-else @blur="finishEdit" @keyup.enter="finishEdit"/>
          <b-button variant="link" class="ml-3" v-if="!editMode" @click="editMode = true"><font-awesome-icon icon="pencil-alt" size="lg"/></b-button>
          <b-button variant="link" v-if="!editMode" @click="deleteComparison"><font-awesome-icon icon="trash-alt" size="lg"/></b-button>
        </div>
      </div>
      <div class="col-6 pr-0 text-right">
        <div v-if="comparison.polishes.length != 0" class="mr-5">
          <b-form-checkbox v-if="containsSolar" switch v-model="solarChecked" size="lg" class="mr-4">
            <font-awesome-icon icon="sun" class="text-warning" size="lg"/>
          </b-form-checkbox>
          <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <span v-if="comparison.polishes.length == 0" class="ml-5">Please add polishes from the <strong>Browse Collection</strong> view to compare.</span>
      <b-carousel v-else class="w-100 mt-3" :controls="comparison.polishes.length > 3" :interval="0" @sliding-end="handleResize">
        <b-carousel-slide v-for="(slide, index1) in slides" :key="index1">
          <template v-slot:img>
            <b-row align-h="center">
              <b-col cols="3" v-for="(card, index2) in slide" :key="card.polish.id">
                <ComparisonPolish 
                  :card="card" 
                  :index="3 * index1 + index2" 
                  :finish="finish" 
                  :comparisonLength="comparison.polishes.length"
                  :cardHeight="cardHeight"
                  :isSun="solarChecked"
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
      solarChecked: false // whether the solar toggle is checked or not (when a comparison contains a solar polish)
    }
  },
  computed: {
    /** Arranges the list of polishes to compare in a Bootstrap carousel. */
    slides: function() {
      const output = [];
      const numSlides = Math.ceil(this.comparison.polishes.length / 3);
      let counter = 0;
      for (let i=0; i < numSlides; i++) {
        const slide = [];
        for (let j=0; j < 3; j++) {
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

    /** Check whether the comparison contains a solar polish, in order to display the toggle. */
    containsSolar: function() {
      return this.comparison.polishes.some(item => item.polish.type == 'Solar');
    }
  },
  methods: {
    /** Ensure that the name is saved with a maximum amount of characters, and if empty save a default name. */
    finishEdit() {
      this.editMode = false;
      if ('' == this.comparison.name.trim()) {
        this.comparison.name = 'Comparison ' + (this.$vnode.key + 1);
      } else if (this.comparison.name.length > this.maxNameLength) {
        this.comparison.name = this.comparison.name.substring(0, this.maxNameLength);
      }
    },
    
    /** Handle the deletion of the comparison in the parent component. */
    deleteComparison() {
      this.$emit("deleteComparison", this.$vnode.key);
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
      this.comparison.polishes.splice(event, 1);
    },

    /** Handle the resizing of a polish's card in the parent component. */
    handleResize() {
      this.$emit("resize");
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

.comparison >>> .carousel-control-prev, .comparison >>> .carousel-control-next {
  filter: invert(100%);
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
