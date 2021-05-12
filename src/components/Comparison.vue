<template>
  <div class="row mb-4">
    <div class="container-fluid">
      <div class="row ml-0 mr-0 align-items-center">
        <div class="ml-5">
          <strong v-if="!editMode">{{ comparison.name }}</strong>
          <b-form-input v-model="comparison.name" autofocus v-else @blur="finishEdit"></b-form-input>
        </div>
        <b-button variant="link" class="ml-2" v-if="!editMode" @click="editMode = true"><font-awesome-icon icon="pencil-alt"/></b-button>
        <b-button variant="link" v-if="!editMode" @click="deleteComparison"><font-awesome-icon icon="trash-alt"/></b-button>
      </div>
      <div class="row ml-0 mr-0 mt-2">
        <span v-if="comparison.polishes.length == 0" class="ml-5">
          Please add polishes from the <strong>Browse Collection</strong> view to this list to compare.
        </span>
        <ul v-else class="ml-5">
          <li v-for="(polish, index) in comparison.polishes" :key="index"><strong>{{ polish.brand }}</strong> - {{ polish.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comparison',
  props: ['comparison'],
  data: function() {
    return {
      editMode: false
    }
  },
  methods: {
    finishEdit() {
      this.editMode = false;
      if ('' == this.comparison.name.trim()) {
        this.comparison.name = 'Comparison ' + (this.$vnode.key + 1);
      }
    },
    
    deleteComparison() {
      this.$emit("deleteComparison", this.$vnode.key);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
