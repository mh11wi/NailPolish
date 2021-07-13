<template>
  <b-row class="mt-3">
    <b-col class="col-fixed-width">
      <b-img-lazy 
        :src="getImage(entry.id)" 
        :alt="entry.alt"
        width="400"
        height="400"
        blank-color="black"
      >
      </b-img-lazy>
    </b-col>
    <b-col>
      <div class="ml-2">
        <p class="mt-2"><strong>{{ entry.date }}</strong></p>
        <p>{{ entry.description }}</p>
        <p class="text-underline mb-1">Polishes Used</p>
        <ul>
          <li v-for="(polish, index) in entry.polishes" :key="index">
            <strong>{{ polish.brand }}</strong> - {{ polish.name }}
          </li>
        </ul>
      </div>
    </b-col>
  </b-row>
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

ul, p {
  margin-bottom: 0.5rem;
}

.col-fixed-width {
  flex: 0 0 400px;
}
</style>
