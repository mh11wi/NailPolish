<template>
  <div class="container-fluid mb-4 comparison">
    <div class="row align-items-center">
      <div class="col-6 pl-0">
        <div class="ml-5">
          <strong v-if="!editMode">{{ comparison.name }}</strong>
          <b-form-input v-model="comparison.name" autofocus maxLength="18" v-else @blur="finishEdit" @keyup.enter="finishEdit"/>
          <b-button variant="link" class="ml-2" v-if="!editMode" @click="editMode = true"><font-awesome-icon icon="pencil-alt"/></b-button>
          <b-button variant="link" v-if="!editMode" @click="deleteComparison"><font-awesome-icon icon="trash-alt"/></b-button>
        </div>
      </div>
      <div class="col-6 pr-0 text-right">
        <div v-if="comparison.polishes.length != 0" class="mr-5">
          <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <span v-if="comparison.polishes.length == 0" class="ml-5">Please add polishes from the <strong>Browse Collection</strong> view to compare.</span>
      <b-carousel v-else class="w-100" controls :interval="0">
        <b-carousel-slide v-for="(slide, index1) in slides" :key="index1">
          <template v-slot:img>
            <b-row align-h="center">
              <b-col cols="12" sm="3" v-for="(polish, index2) in slide" :key="index2">
                <b-card :img-src="getImage(polish.id)" img-top no-body border-variant="white" class="mt-4">
                  <b-card-body>
                    <b-card-text class="text-center">
                      <strong>{{ polish.brand }}</strong><br>{{ polish.name }}
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row>
          </template>
        </b-carousel-slide>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue';

export default {
  name: 'Comparison',
  components: {
    FinishToggle
  },
  props: ['comparison'],
  data: function() {
    return {
      editMode: false,
      finish: 'glossy'
    }
  },
  computed: {
    slides: function() {
      const output = [];
      const numSlides = Math.ceil(this.comparison.polishes.length / 3);
      let counter = 0;
      for (let i=0; i < numSlides; i++) {
        const slide = [];
        for (let j=0; j < 3; j++) {
          if (counter < this.comparison.polishes.length) {
            slide.push(this.comparison.polishes[counter]);
            counter++;
          } else {
            break;
          }
        }
        output.push(slide);
      }
      return output;
    }
  },
  methods: {
    finishEdit() {
      this.editMode = false;
      if ('' == this.comparison.name.trim()) {
        this.comparison.name = 'Comparison ' + (this.$vnode.key + 1);
      } else if (this.comparison.name.length > 18) {
        this.comparison.name = this.comparison.name.substring(0, 18);
      }
    },
    
    deleteComparison() {
      this.$emit("deleteComparison", this.$vnode.key);
    },

    getImage(polishId) {
      const finishId = this.finish == 'glossy' ? 1 : 2;
      return require('@/assets/images/polishes/' + polishId + '/' + finishId + '.jpg');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comparison >>> .carousel-caption {
  color: black;
}

.comparison >>> .carousel-control-prev, .comparison >>> .carousel-control-next {
  filter: invert(100%);
}
</style>
