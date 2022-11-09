<template>
  <div class="polish">
    <div v-b-modal="polish.id" class="text-center mx-2 mb-3">
      <b-overlay :show="polish.type == 'Solar' || polish.type == 'Glow in the Dark'" :opacity="0">
        <b-img-lazy 
          :src="getImage(polish.id, false)" 
          :alt="polish.name" 
          blank-color="black"
          fluid
        >
        </b-img-lazy>
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
    <b-modal :id="polish.id" :title="polish.name" :hide-footer=true ref="modal" title-tag="h2">
      <b-row style="height: 300px">
        <b-col cols="5">
          <img-comparison-slider v-if="polish.type == 'Solar'">
            <img slot="before" :src="getImage(polish.id, true, '-sun')" :alt="polish.name + ' in the sun'" width="300px">
            <img slot="after" :src="getImage(polish.id, true)" :alt="polish.name" width="300px">
            <img slot="handle" src="https://api.iconify.design/fa-solid:sun.svg?color=%23ffc107&height=30" role="none">
          </img-comparison-slider>
          <img-comparison-slider v-else-if="polish.type == 'Glow in the Dark'">
            <img slot="before" :src="getImage(polish.id, true, '-dark')" :alt="polish.name + ' in the dark'" width="300px">
            <img slot="after" :src="getImage(polish.id, true)" :alt="polish.name" width="300px">
            <img slot="handle" src="https://api.iconify.design/fa-solid:moon.svg?color=%23ffc107&width=35&height=30" role="none">
          </img-comparison-slider>
          <b-img-lazy
            v-else
            :src="getImage(polish.id, true)" 
            :alt="polish.name" 
            width=300 
            blank-color="black"
          >
          </b-img-lazy>
        </b-col>
        <b-col cols="7" class="h-100 d-flex flex-column">
          <div class="row align-items-center ml-2">
            <div class="col-5 pl-0">
              <FinishToggle v-model="modalFinish" @updateFinish="modalFinish = $event"/>
            </div>
            <div class="col-7 pl-0">
              <b-button v-if="hasToppers" variant="primary" @click="viewToppers">Top It Off</b-button>
            </div>
          </div>
          <div class="row ml-2 align-items-center flex-grow-1">
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
                  <td>{{ polish.color }}</td>
                </tr>
                <tr>
                  <td><strong>Coats:</strong></td>
                  <td>{{ polish.numCoats }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row align-items-center ml-2 mr-0">
            <div class="col-6 pl-0 pr-0">
              <b-dropdown text="Add to Comparison" variant="primary" dropup>
                <b-dropdown-item v-for="(option, index) in options" :key="index" @click="comparisonSelected(option.value)" :disabled="option.disabled">
                  {{ option.text }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="col-6 pl-0 pr-0 text-success small">
              <span v-if="showAlert"><span class="mr-2"><font-awesome-icon icon="check"/></span>Added to {{ addedComparison }}</span>
            </div>
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
      output.push({value: -1, text: 'Create new...'});
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

td {
  vertical-align: baseline;
}

img-comparison-slider {
  --divider-color: #ffc107;
  --handle-size: 30px;
  --handle-opacity: 1;
  --handle-opacity-active: 1;
}
</style>
