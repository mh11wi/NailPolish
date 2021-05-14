<template>
  <div class="container-fluid mb-4">
    <div class="row align-items-center">
      <div class="ml-5">
        <strong v-if="!editMode">{{ comparison.name }}</strong>
        <b-form-input v-model="comparison.name" autofocus maxLength="18" v-else @blur="finishEdit" @keyup.enter="finishEdit"/>
      </div>
      <b-button variant="link" class="ml-2" v-if="!editMode" @click="editMode = true"><font-awesome-icon icon="pencil-alt"/></b-button>
      <b-button variant="link" v-if="!editMode" @click="deleteComparison"><font-awesome-icon icon="trash-alt"/></b-button>
    </div>
    <div class="row mt-2">
      <span v-if="comparison.polishes.length == 0" class="ml-5">
        Please add polishes from the <strong>Browse Collection</strong> view to compare.
      </span>
      <ul v-else class="ml-5 mb-0">
        <li v-for="(polish, index) in comparison.polishes" :key="index"><strong>{{ polish.brand }}</strong> - {{ polish.name }}</li>
      </ul>
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
      } else if (this.comparison.name.length > 18) {
        this.comparison.name = this.comparison.name.substring(0, 18);
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
