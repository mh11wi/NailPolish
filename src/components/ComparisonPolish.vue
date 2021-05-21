<template>
  <div class="polish">
    <b-overlay :show="true" :opacity="0">
      <b-card v-if="!detailsMode" class="border-0" :img-src="getImage(polish.id)" :img-alt="polish.name" img-top no-body/>
      <b-card v-else class="polishDetails pt-5" no-body>
        <b-card-text class="mx-3 h-100 d-flex flex-column">
          <b-row align-v="center">
            <b-col cols="5">
              <b-img-lazy :src="getImage(polish.id)" :alt="polish.name" blank-color="black" fluid/>
            </b-col>
            <b-col cols="7" class="px-0">
              <p class="mb-1">{{ polish.type }}</p>
              <p class="mb-1">{{ polish.numCoats }} coat{{ polish.numCoats == 1 ? '' : 's'}}</p>
            </b-col>
          </b-row>
          <b-row align-v="center" class="flex-grow-1">
            <b-col>
              <div class="text-center">{{ polish.color }}</div>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>
      <template #overlay>
        <div class="row align-items-center mt-1 mx-0">
          <div class="col-3 px-0">
            <b-button variant="link" class="text-decoration-none" size="sm" @click="toggleMode">
              <strong v-if="!detailsMode">Details</strong>
              <strong v-else>Back</strong>
            </b-button>
          </div>
          <div class="col-6 px-0 text-center">
            <b-button variant="link" class="text-decoration-none px-2" size="lg" @click="movePolish(-1)" :disabled="index == 0">
              <font-awesome-icon icon="arrow-left"/>
            </b-button>
            <b-button variant="link" class="text-decoration-none px-2" size="lg" @click="movePolish(1)" :disabled="index == length - 1">
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
      <strong>{{ polish.brand }}</strong>
      <br>{{ polish.name }}
      <br><span class="small">{{ polish.collection || '-' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComparisonPolish',
  props: ['polish', 'index', 'finish', 'length'],
  data: function() {
    return {
      detailsMode: false
    }
  },
  updated() {
    if (this.detailsMode) {
      const width = this.$el.offsetWidth;
      alert(width)
      this.$el.querySelectorAll('.polishDetails')[0].setAttribute('style', 'height: ' + width + 'px');
    }
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
      this.detailsMode = !this.detailsMode;
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
