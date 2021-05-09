<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 toppersColumn">
        <b-form-radio-group v-model="selectedTopperId" :options="options" class="mt-2" stacked />
      </div>
      <div class="col-8 display">
        <div class="mt-2 mb-2"><strong>{{ basePolish.brand }}</strong> - {{ basePolish.name }}</div>
        <b-img-lazy 
          :src="getImage(basePolish.id)" 
          :alt="basePolish.name" 
          width=400 
          blank-color="black"
        >
        </b-img-lazy>
      </div>
    </div>
  </div>
</template>

<script>
import polishes from '../data/polishes.json'
import toppersMap from '../data/toppersMap.json'

export default {
  name: 'Toppers',
  data: function() {
    return {
      basePolish: polishes[31],
      selectedTopperId: 1
    }
  },
  computed: {
    toppers: function() {
      const topperIds = toppersMap[this.basePolish.id];
      topperIds.unshift(1, 2);
      const output = [];
      
      topperIds.forEach(function(id) {
        output.push(polishes[id - 1]);
      });
      
      return output;
    },
    options: function() {
      const output = [];
      
      this.toppers.forEach(function(topper) {
        const optionHtml = topper.brand != '' ? "<strong>" + topper.brand + "</strong> - " + topper.name : topper.name
        output.push({html: optionHtml, value: topper.id});
      });
      
      return output;
    }
  },
  methods: {
    getImage(polishId) {
      return require('@/assets/' + polishId + '/' + this.selectedTopperId + '.jpg');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toppersColumn {
  border-right: solid 1px #dee2e6;
}

.display {
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  min-height: calc(100vh - 110px);
}
</style>
