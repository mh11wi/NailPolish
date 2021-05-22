<template>
  <div class="polish">
    <b-overlay :show="true" :opacity="0">
      <b-card v-if="!card.detailsMode" class="border-0" :img-src="getImage(card.polish.id)" :img-alt="card.polish.name" img-top no-body/>
      <b-card v-else class="pt-5" :style="{ height: cardHeight + 'px' }" no-body>
        <b-card-text class="mx-3 h-100 d-flex flex-column">
          <b-row align-v="center">
            <b-col cols="6">
              <b-img-lazy :src="getImage(card.polish.id)" :alt="card.polish.name" blank-color="black" fluid/>
            </b-col>
            <b-col cols="6" class="pl-0">
              <p class="mb-1">{{ card.polish.type }}</p>
              <p class="mb-1">{{ card.polish.numCoats }} coat{{ card.polish.numCoats == 1 ? '' : 's'}}</p>
            </b-col>
          </b-row>
          <b-row align-v="center" class="flex-grow-1">
            <b-col>
              <div class="text-center">{{ card.polish.color }}</div>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>
      <template #overlay>
        <div class="row align-items-center mt-1 mx-0">
          <div class="col-3 px-0">
            <b-button variant="link" class="text-decoration-none" size="sm" @click="toggleMode">
              <strong v-if="!card.detailsMode">Details</strong>
              <strong v-else>Back</strong>
            </b-button>
          </div>
          <div class="col-6 px-0 text-center">
            <b-button variant="link" class="text-decoration-none px-2" size="lg" @click="movePolish(-1)" :disabled="index == 0">
              <font-awesome-icon icon="arrow-left"/>
            </b-button>
            <b-button variant="link" class="text-decoration-none px-2" size="lg" @click="movePolish(1)" :disabled="index == comparisonLength - 1">
              <font-awesome-icon icon="arrow-right"/>
            </b-button>
          </div>
          <div class="col-3 px-0 text-right">
            <b-button variant="link" class="text-decoration-none" size="lg" @click="removePolish">
              <font-awesome-icon icon="times"/>
            </b-button>
          </div>
        </div>
      </template>
    </b-overlay>
    <div class="text-center mt-2">
      <strong>{{ card.polish.brand }}</strong>
      <br>{{ card.polish.name }}
      <br><span class="small">{{ card.polish.collection || '-' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComparisonPolish',
  props: ['card', 'index', 'finish', 'comparisonLength', 'cardHeight'],
  updated() {
    this.$emit("resize");
  },
  methods: {
    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? 1 : 2;
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + '.jpg');
    },

    movePolish(dir) {
      this.$emit("movePolish", {index: this.index, dir: dir});
    },

    removePolish() {
      this.$emit("removePolish", this.index);
    },

    toggleMode() {
      this.card.detailsMode = !this.card.detailsMode;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.polish >>> .card-footer {
  border-left: 1px solid white;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  margin: -1px;
}
</style>
