<template>
  <div>
    <div v-b-modal="polish.id" class="text-center ml-3 mb-3">
      <b-img-lazy 
        :src="getImage(polish.id, false)" 
        :alt="polish.name" 
        width=175 
        blank-color="black"
      >
      </b-img-lazy>
      <div><strong>{{ polish.brand }}</strong></div>
      <div>{{ polish.name }}</div>
    </div>
    <b-modal :id="polish.id" :title="polish.name" :hide-footer=true ref="modal">
      <div class="row">
        <div class="col-5">
          <b-img-lazy 
            :src="getImage(polish.id, true)" 
            :alt="polish.name" 
            width=300 
            blank-color="black"
          >
          </b-img-lazy>
        </div>
        <div class="col-7 mt-2">
          <FinishToggle class="ml-2 mb-4" v-model="modalFinish" @updateFinish="modalFinish = $event"/>
          <table class="ml-2 w-100">
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
          <div class="row align-items-center ml-2 mr-0 mt-4">
            <div class="col-7 pl-0 comparisonsList">
              <b-form-select v-model="selectedComparison" :options="options" @change="comparisonSelected"/>
            </div>
            <div class="col-4">
              <b-button v-if="hasToppers" variant="primary" @click="viewToppers">Top It Off</b-button>
            </div>
          </div>
        </div>
      </div>
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
      selectedComparison: null
    }
  },
  props: ['polish', 'finish', 'hasToppers', 'comparisons'],
  computed: {
    options: function() {
      const output = [{value: null, text: 'Add to a comparison list'}];
      for (let i=0; i < this.comparisons.length; i++) {
        const disabled = this.comparisons[i].polishes.includes(this.polish);
        output.push({value: i, text: this.comparisons[i].name, disabled: disabled});
      }
      output.push({value: -1, text: 'Create new comparison list...'});
      return output;
    }
  },
  mounted: function() {
    this.$root.$on('bv::modal::show', () => {
      this.modalFinish = this.finish;
    });
  },
  methods: {
    getImage(polishId, isModal) {
      const thisFinish = isModal? this.modalFinish : this.finish
      const finishId = thisFinish == 'glossy' ? '1' : '2';
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + '.jpg');
    },
    
    viewToppers() {
      this.$refs["modal"].hide();
      this.$emit("viewToppers", {basePolish: this.polish, finish: this.modalFinish});
    },
    
    comparisonSelected() {
      if (this.selectedComparison == null) {
        return;
      }
        
      if (this.selectedComparison == -1) {
        const newName = 'Comparison ' + (this.comparisons.length + 1);
        this.comparisons.push({name: newName, polishes: [this.polish]});
        // alert that compares list was created
      } else {
        this.comparisons[this.selectedComparison].polishes.push(this.polish);
        // alert that polish was added
      }
      
      this.selectedComparison = null;
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comparisonsList >>> option:first-child {
  display: none;
}
</style>
