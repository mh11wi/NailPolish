<template>
  <div class="polish">
    <div v-b-modal="polish.id" class="text-center mx-2 mb-3">
      <b-overlay :show="polish.destashed || polish.suffix" :opacity="0">
        <b-img-lazy 
          v-show="finish === 'glossy'"
          ref="glossy"
          :src="getImage(polish.id, 'glossy')"
          :alt="polish.name" 
          :blank-color="placeholderColor"
          fluidGrow
        />
        <b-img-lazy 
          v-if="showFinishToggle"
          v-show="finish === 'matte'"
          ref="matte"
          :src="getImage(polish.id, 'matte')"
          :alt="polish.name" 
          :blank-color="placeholderColor"
          fluidGrow
        />
        <template #overlay v-if="polish.destashed">
          <div class="mt-3 mr-2 text-right text-danger">
            <font-awesome-icon icon="ban" size="lg"/>
          </div>
        </template>
        <template #overlay v-else-if="polish.suffix">
          <div class="mt-3 mr-2 text-right text-warning">
            <font-awesome-icon :icon="getIcon(polish.suffix)" size="lg"/>
          </div>
        </template>
      </b-overlay>
      <div class="mt-1 line-height-small"><strong>{{ polish.brand }}</strong></div>
      <div class="line-height-small">{{ polish.name }}</div>
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
          <img-comparison-slider v-if="polish.suffix" class="w-100">
            <b-img 
              slot="before" 
              :src="getImage(polish.id, modalFinish, polish.suffix)" 
              :alt="polish.name + ' state one'" 
              :blank-color="placeholderColor"
              @error="handleImageError" 
              fluidGrow
            />
            <b-img 
              slot="after" 
              :src="getImage(polish.id, modalFinish)" 
              :alt="polish.name + ' state two'" 
              :blank-color="placeholderColor"
              @error="handleImageError"
              fluidGrow
            />
            <font-awesome-icon 
              slot="handle" 
              :icon="getIcon(polish.suffix)" 
              :class="['sliderHandle', getIcon(polish.suffix) == 'moon' ? 'ml-1' : '']" 
            />
          </img-comparison-slider>
          <b-img
            v-else
            :src="getImage(polish.id, modalFinish)" 
            :alt="polish.name" 
            :blank-color="placeholderColor"
            @error="handleImageError"
            fluidGrow
          />
        </b-col>
        <b-col cols="12" sm="7" class="polishData d-flex flex-column justify-content-between">
          <div :class="['polishActions', 'row', actionsClass]">
            <FinishToggle v-model="modalFinish" @updateFinish="modalFinish = $event" />
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
            <b-button v-if="hasToppers" variant="primary" @click="viewToppers">Top It Off</b-button>
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
    },
	
    /** The dynamic class for the row of actions in the modal. */
    actionsClass: function() {
      if (!this.showFinishToggle || !this.hasToppers) {
        return 'justify-content-start';
      }
      
      return 'justify-content-between';
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
	
    this.$refs.glossy.$el.onerror = this.handleImageError;
    if (this.showFinishToggle) {
      this.$refs.matte.$el.onerror = this.handleImageError;
    }
  },
  methods: {
    /**
     * Gets the specified polish image.
     * @param polishId - the id of the polish
     * @param isModal - whether the image is for the modal or not (so appropriate finish is displayed)
     * @param suffix - an optional suffix to the image file (e.g. '-sun' for solar, '-dark' for glow in the dark)
     */
    getImage(polishId, finish, suffix = '') {
      const finishId = finish === 'glossy' ? import.meta.env.VITE_GLOSSY : import.meta.env.VITE_MATTE;
      return new URL(`../assets/images/polishes/${polishId}/${finishId}${suffix}${import.meta.env.VITE_EXTENSION}`, import.meta.url).href;
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
.polish :deep(.position-absolute) {
  left: 0 !important;
  top: 0 !important;
  transform: none !important;
  width: 100%;
  margin-top: -0.25rem;
}

.polishActions {
  align-items: center;
  width: 100%;
}

.polishActions.justify-content-start {
  gap: 30px;
}

@media (width < 576px) {
  .polishActions {
    justify-content: center !important;
    margin-bottom: 1rem;
    gap: 30px;
  }

  .polishData {
    margin-top: 1rem;
    margin-right: -2rem;
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

.text-success {
  font-size: 0.75rem;
}
</style>
