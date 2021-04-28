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
    <b-modal :id="polish.id" :title="polish.name" size="md">
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
        <div class="col-7">
          <div class="ml-2 mb-2"><strong>Name:</strong> {{ polish.name }}</div>
          <div class="ml-2 mb-2"><strong>Brand:</strong> {{ polish.brand }}</div>
          <div class="ml-2 mb-2"><strong>Type:</strong> {{ polish.type }}</div>
          <div class="ml-2 mb-2"><strong>Colour:</strong> {{ polish.color }}</div>
          <div class="ml-2 mb-2"><strong>Number of Coats:</strong> {{ polish.numCoats }}</div>
        </div>
      </div>
      
      <template #modal-footer>
        <div class="w-100">
          <FinishToggle class="float-left" v-model="finish" @updateFinish="updateFinish"/>
          <b-button class="float-right" variant="secondary" @click="$bvModal.hide(polish.id)">Close</b-button>
        </div>
      </template>
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
