<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 toppersColumn">
        <div v-for="(topper, index) in toppers" :key="index">
            <span v-if="topper.brand != ''"><strong>{{ topper.brand }}</strong> - </span>{{ topper.name }}
        </div>
      </div>
      <div class="col-8 display">
        {{ basePolish.name }}
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
      basePolish: polishes[11]
    }
  },
  computed: {
    toppers: function() {
      const topperIds = toppersMap[this.basePolish.id];
      const output = [];
      
      topperIds.forEach(function(id) {
        output.push(polishes[id - 1]);
      });
      
      return output;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toppersColumn {
  padding-top: 1rem;
  border-right: solid 1px #dee2e6;
}

.display {
  padding-top: 1rem;
  border-left: solid 1px #dee2e6;
  margin-left: -1px;
  min-height: calc(100vh - 106px);
}
</style>
