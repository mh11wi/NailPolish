<template>
  <div class="polish">
    <div v-b-modal="polish.id" class="text-center mx-2 mb-3">
      <b-overlay :show="polish.type == 'Solar'" :opacity="0">
        <b-img-lazy 
          :src="getImage(polish.id, false, false)" 
          :alt="polish.name" 
          blank-color="black"
          fluid
        >
        </b-img-lazy>
        <template #overlay>
          <div class="mt-3 mr-2 text-right text-warning">
            <font-awesome-icon icon="sun" size="lg"/>
          </div>
        </template>
      </b-overlay>
      <div><strong>{{ polish.brand }}</strong></div>
      <div>{{ polish.name }}</div>
    </div>
    <b-modal :id="polish.id" :title="polish.name" :hide-footer=true ref="modal">
      <b-row style="height: 300px">
        <b-col cols="5">
          <img-comparison-slider v-if="polish.type == 'Solar'">
            <img slot="before" :src="getImage(polish.id, true, true)" :alt="polish.name + ' in the sun'" width="300px">
            <img slot="after" :src="getImage(polish.id, true, false)" :alt="polish.name" width="300px">
            <img slot="handle" src="https://api.iconify.design/fa-solid:sun.svg?color=%23ffc107&height=30">
          </img-comparison-slider>
          <b-img-lazy
            v-else
            :src="getImage(polish.id, true, false)" 
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

export default {
  name: 'PolishTile',
  components: {
    FinishToggle
  },
  data: function() {
    return {
      modalFinish: this.finish,
      showAlert: false,
      addedComparison: ''
    }
  },
  props: ['polish', 'finish', 'hasToppers', 'comparisons'],
  computed: {
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
    getImage(polishId, isModal, isSun) {
      const thisFinish = isModal? this.modalFinish : this.finish
      const finishId = thisFinish == 'glossy' ? '1' : '2';
      const appendSun = isSun ? '-sun' : '';
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + appendSun + '.jpg');
    },
    
    viewToppers() {
      this.$refs["modal"].hide();
      this.$emit("viewToppers", {basePolish: this.polish, finish: this.modalFinish});
    },
    
    comparisonSelected(selectedComparison) {
      if (selectedComparison == -1) {
        const newName = 'Comparison ' + (this.comparisons.length + 1);
        this.comparisons.push({name: newName, polishes: [{polish: this.polish, detailsMode: false}]});
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
