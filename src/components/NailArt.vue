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
            <span v-if="!polish.id">
              <strong>{{ polish.brand }}</strong> - {{ polish.name }}
            </span>
            <div v-else>
              <strong>{{ polishes[polish.id - 1].brand }}</strong> - {{ polishes[polish.id - 1].name }}
              <b-link :id="entry.id + '_' + polish.id" tabindex="0">
                <font-awesome-icon icon="question-circle"/>
              </b-link>
              <b-popover :target="entry.id + '_' + polish.id"  fallback-placement="counterclockwise" triggers="focus">
                <b-img-lazy
                  :src="getPolishImage(polish.id)" 
                  :alt="polishes[polish.id - 1].name" 
                  width=200 
                  blank-color="black"
                >
                </b-img-lazy>
              </b-popover>
            </div>
          </li>
        </ul>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'NailArt',
  props: ['entry', 'polishes'],
  methods: {
    getImage(id) {
      return require('@/assets/images/nailart/' + id + '.jpg');
    },
    
    getPolishImage(id) {
      if (this.polishes[id - 1].type == 'Topper') {
        return require('@/assets/images/polishes/32/' + id + '.jpg');
      }
      
      return require('@/assets/images/polishes/' + id + '/1.jpg');
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

.popover {
  min-width: 200px;
}
</style>
