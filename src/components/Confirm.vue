<template>
  <div id="content">
    <el-row>
      <el-col :sm="12" :xs="24">
        <h3 class="title">Schedule Appointment</h3>
        <p>{{ moment(timeslot.start.toISOString()).format('HH:mm - dddd, MMMM DD, Y') }}</p>
      </el-col>
      <el-col :sm="12" :xs="24">
        <el-form ref="form" :model="form" label-position="top">
          <el-form-item
            prop="name"
            label="Name"
            :rules="[
              { required: true, message: 'Please input your name', trigger: 'blur' },
            ]"
          >
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="Email"
            :rules="[
              { required: true, message: 'Please input email address', trigger: 'blur' },
              { type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }
            ]"
          >
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-button type="primary" @click="schedule">Schedule</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var moment = require('moment-timezone');
import { EventBus } from './event-bus.js';
import { forEach } from 'lodash';
import { Loading } from 'element-ui';

export default {
  name: 'ConfirmPage',

  props: {
    timeslot: Object
  },

  data () {
    return {
      moment,
      form: {
        name: '',
        email: ''
      }
    }
  },

  methods: {
    schedule () {
      this.$emit('schedule-success', this.name, this.email);
      return;

      this.$refs.form.validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          Visualforce.remoting.Manager.invokeAction(
            window.globalIds.CalendarController.schedule,
            this.timeslot.id,
            this.form.name,
            this.form.email,
            (error, event) => {
              loadingInstance.close();
              if (error) {
                this.$error(error);
              } else {
                this.$emit('schedule-success', name, email);
                EventBus.$emit('calendar-refetch-events');
              }
            },
            { escape: true }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
#content {
  max-width: 1080px;
  margin: 20px auto;
}

.title {
  font-weight: 900;
  margin: 0 0 20px 0;
}
</style>
