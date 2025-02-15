<template>
  <div class="polish">
    <div v-b-modal="polish.id" class="text-center mx-2 mb-3">
      <b-overlay :show="polish.type == 'Solar' || polish.type == 'Glow in the Dark'" :opacity="0">
        <b-img-lazy 
          :src="getImage(polish.id, false)" 
          :alt="polish.name" 
          blank-color="black"
          fluid
        />
        <template #overlay v-if="polish.type == 'Solar'">
          <div class="mt-3 mr-2 text-right text-warning">
            <font-awesome-icon icon="sun" size="lg"/>
          </div>
        </template>
        <template #overlay v-else-if="polish.type == 'Glow in the Dark'">
          <div class="mt-3 mr-2 text-right text-warning">
            <font-awesome-icon icon="moon"/>
          </div>
        </template>
      </b-overlay>
      <div><strong>{{ polish.brand }}</strong></div>
      <div>{{ polish.name }}</div>
    </div>
    <b-modal centered :id="polish.id" :hide-footer=true ref="modal" title-tag="h2" title-class="d-flex flex-wrap align-items-center" body-class="d-flex">
      <template #modal-title>
        <span class="mr-3">{{ polish.name }}</span>
        <span v-if="showAlert" class="text-success">
          <font-awesome-icon icon="check"/>
          <span class="ml-2">Added to {{ addedComparison }}</span>
        </span>
      </template>
      <b-row class="flex-grow-1 align-items-center justify-content-center">
        <b-col cols="6" sm="5">
          <img-comparison-slider v-if="polish.type == 'Solar'">
            <b-img slot="before" :src="getImage(polish.id, true, '-sun')" :alt="polish.name + ' in the sun'" fluid/>
            <b-img slot="after" :src="getImage(polish.id, true)" :alt="polish.name" fluid/>
            <img slot="handle" src="https://api.iconify.design/fa-solid:sun.svg?color=%23ffc107&height=30" role="none">
          </img-comparison-slider>
          <img-comparison-slider v-else-if="polish.type == 'Glow in the Dark'">
            <b-img slot="before" :src="getImage(polish.id, true, '-dark')" :alt="polish.name + ' in the dark'" fluid/>
            <b-img slot="after" :src="getImage(polish.id, true)" :alt="polish.name" fluid/>
            <img slot="handle" src="https://api.iconify.design/fa-solid:moon.svg?color=%23ffc107&width=35&height=30" role="none">
          </img-comparison-slider>
          <b-img-lazy
            v-else
            :src="getImage(polish.id, true)" 
            :alt="polish.name" 
            blank-color="black"
            fluid
          />
        </b-col>
        <b-col cols="12" sm="7" class="polishData d-flex flex-column justify-content-between">
          <div class="row align-items-center w-100">
            <div class="col px-0">
              <FinishToggle v-model="modalFinish" @updateFinish="modalFinish = $event" />
            </div>
            <div class="col px-0 text-right">
              <b-dropdown text="Add To " variant="primary">
                <b-dropdown-item 
                  v-for="(option, index) in options" 
                  :key="index" 
                  @click="comparisonSelected(option.value)" 
                  :disabled="option.disabled"
                >
                  {{ option.text }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="col px-0 text-right">
              <b-button v-if="hasToppers" variant="primary" @click="viewToppers">Top It Off</b-button>
            </div>
          </div>
          <div class="row align-items-center flex-grow-1 w-100">
            <table class="w-100">
              <colgroup>
                <col span="1" style="width:25%">
                <col span="1" style="width:75%">
              </colgroup>
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{{ polish.name }}</td>
                </tr>
                <tr>
                  <td><strong>Brand:</strong></td>
                  <td>{{ polish.brand }}</td>
                </tr>
                <tr v-if="polish.collection != ''">
                  <td><strong>Collection:</strong></td>
                  <td>{{ polish.collection }}</td>
                </tr>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>{{ polish.type }}</td>
                </tr>
                <tr>
                  <td><strong>Colour:</strong></td>
                  <td class="line-height-small">{{ polish.color }}</td>
                </tr>
                <tr>
                  <td><strong>Coats:</strong></td>
                  <td>{{ polish.numCoats }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue'

/** A 'polish tile' displays information about a given polish in a modal when clicked. */
export default {
  name: 'PolishTile',
  components: {
    FinishToggle
  },
  props: [
    'polish', // data about a polish
    'finish', // which finish is selected in the parent component (either 'glossy' or 'matte')
    'hasToppers', // whether the polish has any topper images, in order to show 'Top It Off' button
    'comparisonId', // the id for a new comparison
    'comparisons' // the list of polish comparisons, to choose from in a drop-down menu
  ],
  data: function() {
    return {
      modalFinish: this.finish, // which image to display in the modal (either 'glossy' or 'matte'), defaults to the parent
      showAlert: false, // whether it should be shown that the polish was successfully added to a comparison
      addedComparison: '' // that comparison a polish was added to
    }
  },
  computed: {
    /** The options to display in the comparisons drop-down menu. An option is disabled if the polish already exists in the comparison. */
    options: function() {
      const output = [];
      for (let i=0; i < this.comparisons.length; i++) {
        const disabled = this.comparisons[i].polishes.some(item => item.polish === this.polish);
        output.push({value: i, text: this.comparisons[i].name, disabled: disabled});
      }
      output.push({value: -1, text: 'New comparison...'});
      return output;
    }
  },
  /** Adds listeners to reset modal appearance. */
  mounted: function() {
    this.$root.$on('bv::modal::show', () => {
      this.modalFinish = this.finish;
      this.showAlert = false;
    });
    
    this.$root.$on('bv::dropdown::show', () => {
      this.showAlert = false;
    });
  },
  methods: {
    /**
     * Gets the specified polish image.
     * @param polishId - the id of the polish
     * @param isModal - whether the image is for the modal or not (so appropriate finish is displayed)
     * @param suffix - an optional suffix to the image file (e.g. '-sun' for solar, '-dark' for glow in the dark)
     */
    getImage(polishId, isModal, suffix = '') {
      const thisFinish = isModal? this.modalFinish : this.finish
      const finishId = thisFinish == 'glossy' ? process.env.VUE_APP_GLOSSY : process.env.VUE_APP_MATTE;
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + suffix + process.env.VUE_APP_EXTENSION);
    },
    
    /** When the 'Top It Off' button is clicked, close the modal but otherwise handle in the parent component. */
    viewToppers() {
      this.$refs["modal"].hide();
      this.$emit("viewToppers", {id: this.polish.id, finish: this.modalFinish});
    },
    
    /**
     * When a comparison is selected, add the polish to it.
     * @param selectedComparison - the comparison to add to, or -1 if a comparison should first be created
     */
    comparisonSelected(selectedComparison) {
      if (selectedComparison == -1) {
        const newName = 'Comparison ' + (this.comparisons.length + 1);
        this.comparisons.push({id: this.comparisonId, name: newName, polishes: [{polish: this.polish, detailsMode: false}]});
        this.$emit("incrementComparisonId");
        this.addedComparison = newName;
      } else {
        this.comparisons[selectedComparison].polishes.push({polish: this.polish, detailsMode: false});
        this.addedComparison = this.comparisons[selectedComparison].name;
      }
      
      this.showAlert = true;
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.polish >>> .position-absolute {
  left: 0 !important;
  top: 0 !important;
  transform: none !important;
  width: 100%;
  margin-top: -0.25rem;
}

@media (width < 576px) {
  .polishData {
    margin-top: 1rem;
	margin-right: -2rem;
  }
  
  .polishData .row:first-of-type {
    max-width: 420px;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
  }
  
  .polishData .row:last-of-type {
    margin-top: 3.5rem;
  }
}

@media (min-width: 576px) {
  .polishData {
    height: 100%;
	padding-right: 0;
  }
}

td {
  vertical-align: baseline;
}

img-comparison-slider {
  --divider-color: #ffc107;
  --handle-size: 30px;
  --handle-opacity: 1;
  --handle-opacity-active: 1;
}

.text-success {
  font-size: 0.75rem;
}

.line-height-small {
  line-height: 1.2;
}
</style>
