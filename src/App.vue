<template>
  <el-container id="app">
    <el-header class="header" height="auto">
      <img
        style="width: 200px"
        src="http://researchpark.illinois.edu/sites/default/files/color/researchpark-04a05bde/logo.png">
      <h3 style="margin: 0">ResearchPark Event Calendar</h3>
    </el-header>
    <transition name="el-fade-in-linear">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </el-container>
</template>

<script>
export default {
  name: 'app',

  data () {
    return {
    };
  },
  methods: {
  },
  mounted () {
    // window.paraFunction('foo', 'bar', 'baz');
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
  background: #f5f5f5;
  border-bottom: solid 1px #ddd;
  padding: 20px;
}
</style>
