<template>
  <div class="row mt-3">
    <div class="row ml-0 mr-0 align-items-center">
      <div class="comparisonName">
        <span v-if="!editMode">{{ comparison.name }}</span>
        <b-form-input v-model="comparison.name" autofocus v-else @blur="finishEdit"></b-form-input>
      </div>
      <b-button variant="link" class="ml-2" v-if="!editMode" @click="editMode = true"><font-awesome-icon icon="pencil-alt"/></b-button>
      <b-button variant="link" v-if="!editMode" @click="deleteList"><font-awesome-icon icon="trash-alt"/></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompareList',
  props: ['key', 'comparison'],
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
    
    deleteList() {
      this.$emit("deleteList", this.$vnode.key);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comparisonName {
  margin-left: 3rem;
}
</style>
