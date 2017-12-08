<template>
  <div id="app">
    <h2>RP Event Calendar</h2>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    };
  },
  mount () {
    console.log(this.$sforce);
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
