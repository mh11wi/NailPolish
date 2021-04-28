<template>
  <div class="text-center ml-3 mb-3">
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
</template>

<script>
export default {
  name: 'PolishTile',
  props: ['polish', 'finish'],
  methods: {
    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? '1' : '2';
      return require('@/assets/' + polishId + '/' + finishId + '.jpg');
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
