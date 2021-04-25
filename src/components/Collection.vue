<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 filtersColumn">
        <div class="container">
          <div class="row align-items-center stats">
            <div class="col-6 pl-0">
              Polishes: {{ numPolishes }}
            </div>
            <div class="col-6 pr-0 text-right">
              <FinishToggle v-model="finish" @updateFinish="finish = $event"/>
            </div>
          </div>
          <div class="row search mt-3">
            <b-input-group>
              <b-form-input placeholder="Search"></b-form-input>
              <b-input-group-append>
                <b-button>Search</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="row filters mt-3">
            Selected: {{ finish }}
          </div>
        </div>
      </div>
      <div class="col-8 polishList">
        <img alt="Ethereal Chill" :src="getImage('ethereal_chill_' + finish + '.jpg')">
      </div>
    </div>
  </div>
</template>

<script>
import FinishToggle from './FinishToggle.vue'

export default {
  name: 'Collection',
  components: {
    FinishToggle
  },
  data: function() {
    return {
      numPolishes: 1,
      finish: 'glossy'
    }
  },
  methods: {
    getImage(pic) {
      return require('@/assets/' + pic);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filtersColumn {
  padding-top: 1rem;
  border-right: solid 1px #dee2e6;
}

.polishList {
  padding-top: 1rem;
}

img {
  width: 300px;
}
</style>
