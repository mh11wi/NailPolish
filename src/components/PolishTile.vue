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
        <div class="col-7 mt-3">
          <FinishToggle class="ml-2 mb-3" v-model="modalFinish" @updateFinish="modalFinish = $event"/>
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
          <b-button v-if="hasToppers" class="ml-2 mt-3" variant="primary" @click="viewToppers">Top It Off</b-button>
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
      modalFinish: this.finish
    }
  },
  props: ['polish', 'finish', 'hasToppers'],
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
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
