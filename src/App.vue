<template>
  <el-container id="app">
    <el-header class="header" height="auto">
      <div>
<!--         <img
          style="width: 200px"
          src="http://researchpark.illinois.edu/sites/default/files/color/researchpark-04a05bde/logo.png"> -->
        <!-- <h3 style="margin: 0">EnterpriseWorks Tour Appointment</h3> -->
        <el-button @click="previousStep" :disabled="step === 0 || step === 3">Previous</el-button>
      </div>
      <div class="steps">
        <el-steps :active="step" simple finish-status="success">
          <el-step :title="step <= 0 ? 'Select Date' : displayDate"></el-step>
          <el-step :title="step <= 1 ? 'Select Time' : displayTime"></el-step>
          <el-step title="Confirm"></el-step>
        </el-steps>
      </div>
      <!-- <router-link :to="{ path: '/new' }" class="ma-button"><el-button type="primary" size="small">Make Appointment</el-button></router-link> -->
    </el-header>
    <el-main>
      <step-1 v-if="step === 0" @select-date="selectDate"></step-1>
      <step-2 v-if="step === 1" :date="date" @select-slot="selectSlot"></step-2>
      <step-3 v-if="step === 2" :timeslot="slot" @schedule-success="scheduleSuccess"></step-3>
      <step-4 v-if="step === 3" :timeslot="slot" :name="name" :email="email"></step-4>
    </el-main>
<!--     <transition name="el-fade-in-linear">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition> -->
  </el-container>
</template>

<script>
import Calendar from './components/Calendar.vue';
import DayList from './components/DayList.vue';
import Confirm from './components/Confirm.vue';
import Final from './components/Final.vue';

export default {
  name: 'app',

  components: {
    'step-1': Calendar,
    'step-2': DayList,
    'step-3': Confirm,
    'step-4': Final
  },

  data () {
    return {
      step: 0,
      date: null,
      slot: null,
      name: null,
      email: null
    };
  },

  computed: {
    displayDate: function () {
      return this.date && this.date.format("ddd, MMM DD");
    },
    displayTime: function () {
      return this.slot && this.slot.start.format("HH:mm");
    }
  },

  methods: {
    previousStep () {
      if (this.step > 0) {
        this.step --;
      }
    },
    selectDate (date) {
      console.log(date);
      this.date = date;
      this.step ++;
    },
    selectSlot (slot) {
      console.log(slot);
      this.slot = Object.assign({}, slot);
      this.step ++;
    },
    scheduleSuccess (name, email) {
      console.log(name, email);
      this.name = name;
      this.email = email;
      this.step ++;
    }
  },
  mounted () {
    // window.paraFunction('foo', 'bar', 'baz');
  }
};
</script>

<style lang="less">
@import 'fullcalendar/dist/fullcalendar.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
  background: #fff;
  /*border-bottom: solid 1px #ddd;*/
  box-shadow: 0 0 50px 0px rgba(0,0,0,.16);
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  position: relative;
}

.steps {
  max-width: 650px;
  margin: -40px 0 0 auto;
  /*position: absolute;*/

  @media screen and (max-width: 768px) {
    display: none;
  }
}

.ma-button {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
