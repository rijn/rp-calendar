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
  mounted () {
    this.$jsforce.query('SELECT Name FROM Agtech_Summit__c').then(res => {
      console.log(res);
    });
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
