<template>
  <b-row class="mb-3 entry">
    <b-col cols="5" lg="4">
      <b-img-lazy 
        :src="getImage(entry.id)" 
        :alt="entry.alt"
        fluid
        blank-color="black"
      />
    </b-col>
    <b-col cols="7" lg="8">
      <div>
        <p><strong>{{ entry.date }}</strong></p>
        <p>{{ entry.description }}</p>
        <p class="text-underline mb-1">Polishes Used</p>
        <ul>
          <li v-for="(polish, index) in entry.polishes" :key="index">
            <span v-if="!polish.id">
              <strong>{{ polish.brand }}</strong> - {{ polish.name }}
            </span>
            <div v-else>
              <strong>{{ polishes[polish.id - 1].brand }}</strong> - {{ polishes[polish.id - 1].name }}
              <b-link :id="entry.id + '_' + polish.id" tabindex="0" aria-label="See polish">
                <font-awesome-icon icon="question-circle"/>
              </b-link>
              <b-popover 
                :target="entry.id + '_' + polish.id" 
                fallback-placement="counterclockwise" 
                triggers="click blur" 
                boundary-padding="0"
              >
                <b-img-lazy
                  :src="getPolishImage(polish)" 
                  :alt="polishes[polish.id - 1].name" 
                  width=200 
                  blank-color="black"
                />
              </b-popover>
            </div>
          </li>
        </ul>
      </div>
    </b-col>
  </b-row>
</template>

<script>
/** A nail art entry to display in the gallery, with popovers to illustrate the polishes used. */
export default {
  name: 'NailArt',
  props: [
    'entry', // data of the nail art entry
    'polishes' // data of all polishes
  ],
  methods: {
    /**
     * Gets the specified nail art image.
     * @param id - the id of the nail art entry
     */
    getImage(id) {
      return require('@/assets/images/nailart/' + id + process.env.VUE_APP_EXTENSION);
    },
    
    /**
     * Gets the specified polish image. If the polish is a topper, it will be shown over the specifed base polish.
     * @param polish - information about the polish
     */
    getPolishImage(polish) {
      if (polish.base) {
        return require('@/assets/images/polishes/' + polish.base + '/' + polish.id + process.env.VUE_APP_EXTENSION);
      }

      return require('@/assets/images/polishes/' + polish.id + '/' + process.env.VUE_APP_GLOSSY + process.env.VUE_APP_EXTENSION);
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

.popover {
  min-width: 200px;
}
</style>
