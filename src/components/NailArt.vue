<template>
  <div class="row mt-3">
    <div class="col-5">
      <b-img-lazy 
        :src="getImage(entry.id)" 
        :alt="entry.alt" 
        width=400
        height=400
        blank-color="black"
      >
      </b-img-lazy>
    </div>
    <div class="col-7">
      <div class="ml-2">
        <p class="mt-3"><strong>{{ entry.date }}</strong></p>
        <p>{{ entry.description }}</p>
        <p class="text-underline">Polishes Used</p>
        <ul>
          <li v-for="(polish, index) in entry.polishes" :key="index">
            <strong>{{ polish.brand }}</strong> - {{ polish.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NailArt',
  props: ['entry'],
  methods: {
    getImage(id) {
      return require('@/assets/images/nailart/' + id + '.jpg');
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .text-underline {
    text-decoration: underline;
  }
  
  ul {
    padding-left: 1rem;
  }
</style>
