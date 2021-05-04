<template>
  <div>
    <div v-b-modal="polish.id" class="text-center ml-3 mb-3">
      <b-img-lazy 
        :src="getImage(polish.id)" 
        :alt="polish.name" 
        width=175 
        blank-color="black"
      >
      </b-img-lazy>
      <div><strong>{{ polish.brand }}</strong></div>
      <div>{{ polish.name }}</div>
    </div>
    <b-modal :id="polish.id" :title="polish.name" size="md" hide-footer=true>
      <div class="row">
        <div class="col-5">
          <b-img-lazy 
            :src="getImage(polish.id)" 
            :alt="polish.name" 
            width=300 
            blank-color="black"
          >
          </b-img-lazy>
        </div>
        <div class="col-7 mt-3">
          <FinishToggle class="ml-2 mb-4" v-model="finish" @updateFinish="updateFinish"/>
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
  props: ['polish', 'finish'],
  methods: {
    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? '1' : '2';
      return require('@/assets/' + polishId + '/' + finishId + '.jpg');
    },
    updateFinish(finish) {
      this.finish = finish;
      this.$emit("updateFinish", finish);
    },
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
