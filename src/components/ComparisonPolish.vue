<template>
  <b-overlay :show="true" :opacity="0" class="polish">
    <b-card v-if="!detailsMode" :img-src="getImage(polish.id)" :img-alt="polish.name" img-top no-body border-variant="white">
      <b-card-text class="text-center">
        <strong>{{ polish.brand }}</strong><br>{{ polish.name }}
      </b-card-text>
    </b-card>
    <b-card v-else no-body class="h-100 pt-5">
      <b-card-text class="mx-2">
        <b-row class="mb-4">
          <b-col cols="4">
            <b-img-lazy 
              :src="getImage(polish.id)" 
              :alt="polish.name" 
              blank-color="black"
              fluid
            >
            </b-img-lazy>
          </b-col>
          <b-col cols="8" class="pl-0">
            <strong>{{ polish.brand }}</strong><br>{{ polish.name }}
          </b-col>
        </b-row>
        <p class="text-center mb-4">
          {{ polish.collection == '' ? '-' : polish.collection }}
        </p>
        <p>
          <strong>Type:</strong> {{ polish.type }}
        </p>
        <p>
          <strong>Colour:</strong> {{ polish.color }}
        </p>
        <p>
          <strong>Coats:</strong> {{ polish.numCoats }}
        </p>
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
          <b-button variant="link" class="text-decoration-none" @click="movePolish(-1)" :disabled="index == 0"><strong>&lt;</strong></b-button>
          <b-button variant="link" class="text-decoration-none" @click="movePolish(1)" :disabled="index == length - 1"><strong>&gt;</strong></b-button>
        </div>
        <div class="col-3 px-0 text-right">
          <b-button variant="link" class="text-decoration-none" @click="removePolish"><strong>&#x2715;</strong></b-button>
        </div>
      </div>
    </template>
  </b-overlay>
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
.polish >>> .card {
  min-height: 300px !important;
}
</style>
