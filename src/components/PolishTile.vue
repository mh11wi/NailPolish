<template>
  <div>
    <div v-b-modal="polish.id" class="text-center mx-2 mb-3">
      <b-img-lazy 
        :src="getImage(polish.id, false)" 
        :alt="polish.name" 
        blank-color="black"
        fluid
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
          <div class="row align-items-center ml-2 mb-4">
            <div class="col-5 pl-0">
              <FinishToggle v-model="modalFinish" @updateFinish="modalFinish = $event"/>
            </div>
            <div class="col-7 pl-0">
              <b-button v-if="hasToppers" variant="primary" @click="viewToppers">Top It Off</b-button>
            </div>
          </div>
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
      showAlert: false,
      addedComparison: ''
    }
  },
  props: ['polish', 'finish', 'hasToppers', 'comparisons'],
  computed: {
    options: function() {
      const output = [];
      for (let i=0; i < this.comparisons.length; i++) {
        const disabled = this.comparisons[i].polishes.includes(this.polish);
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
    getImage(polishId, isModal) {
      const thisFinish = isModal? this.modalFinish : this.finish
      const finishId = thisFinish == 'glossy' ? '1' : '2';
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + '.jpg');
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

</style>
