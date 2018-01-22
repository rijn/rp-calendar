<template>
  <div id="content">
    <i class="el-icon-circle-check"></i>
    <h2>Your request has been recorded.</h2>
    <br />
    <p>Your tour will be scheduled at</p>
    <h3>{{ displayWeekday }}</h3>
    <h4>{{ displayDate }}</h4>
  </div>
</template>

<script>
var moment = require('moment-timezone');

export default {
  name: 'FinalPage',

  props: {
    timeslot: Object
  },

  data () {
    return {
      moment
    };
  },

  computed: {
    displayWeekday: function () {
      return moment(this.timeslot.start.toISOString()).format("dddd");
    },
    displayDate: function () {
      return moment(this.timeslot.start.toISOString()).format("MMMM DD, Y");
    },
  }
};
</script>

<style scoped lang="less">
#content {
  max-width: 1080px;
  margin: 20px auto;
  text-align: center;
}

i {
  color: #67C23A;
  font-size: 6em;
}
</style>
