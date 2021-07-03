<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 toppersColumn" :style="{ height: height + 'px' }">
        <b-form-radio-group v-model="selectedTopperId" :options="toppers" class="mt-2" stacked/>
      </div>
      <div class="col-8 display" :style="{ height: height + 'px' }">
        <div v-if="basePolish == null">
          Start by selecting an applicable base polish from the <strong>Browse Collection</strong> view.
        </div>
        <div v-else>
          <div class="row justify-content-center">
            <b-img-lazy 
              :src="getImage(basePolish.id)" 
              :alt="basePolish.name" 
              width=400
              height=400
              blank-color="black"
            >
            </b-img-lazy>
          </div>
          <div class="mt-2 row justify-content-center"><strong>{{ basePolish.brand }}</strong></div>
          <div class="row justify-content-center">{{ basePolish.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toppers',
  data: function() {
    return {
      selectedTopperId: ''
    }
  },
  props: ['height', 'toppersMap', 'polishes', 'basePolish', 'defaultTopperId'],
  computed: {
    toppers: function() {
      const topperIds = [1, 2];
      if (this.basePolish != null && this.toppersMap[this.basePolish.id] != null) {
        topperIds.push(...this.toppersMap[this.basePolish.id]);
      }
      
      const options = [];
      const self = this;
      topperIds.forEach(function(id) {
        const topper = self.polishes[id - 1];
        const optionHtml = topper.brand != '' ? "<strong>" + topper.brand + "</strong> - " + topper.name : topper.name;
        const disabled = self.basePolish == null;
        options.push({html: optionHtml, value: topper.id, disabled: disabled});
      });
      return options;
    }
  },
  watch: {
    basePolish: function() {
      this.selectedTopperId = this.defaultTopperId;
    },
    
    defaultTopperId: function() {
      this.selectedTopperId = this.defaultTopperId;
    }
  },
  methods: {
    getImage(polishId) {
      return require('@/assets/images/polishes/' + polishId + '/' + this.selectedTopperId + '.jpg');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toppersColumn {
  padding-top: 1rem;
  border-right: solid 1px #dee2e6;
  overflow-y: auto;
}

.toppersColumn >>> .custom-control {
  padding-bottom: 0.75rem;
}

.display {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  overflow-y: auto;
}
</style>
