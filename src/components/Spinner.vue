<template>
  <div class="container-fluid h-100">
    <div class="row h-100 align-items-center justify-content-center">
      <b-spinner variant="primary" label="Loading..."/>
    </div>
  </div>
</template>

<script>
/** A loading spinner for before the tabs are ready. */
export default {
  name: 'Spinner'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
}
</style>