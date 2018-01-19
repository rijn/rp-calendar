<template>
  <div>
    <h3 class="title">New Appointment</h3>

    <el-form ref="form" :model="form" label-position="top">
      <el-form-item
        prop="title"
        label="Title"
        :rules="[
          { required: true, message: 'Please input event title', trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="Time">
        <el-date-picker
          v-model="form.start"
          type="datetime"
          placeholder="Start date">
        </el-date-picker>
        <el-date-picker
          v-model="form.end"
          type="datetime"
          placeholder="End date">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Description">
        <el-input type="textarea" v-model="form.desc"></el-input>
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
      <el-button @click="insertEvent">Create Event</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </el-form>

  </div>
</template>

<script>
var moment = require('moment');
import { EventBus } from './event-bus.js';
import { forEach } from 'lodash';

export default {
  name: 'EventPage',
  data () {
    return {
      eventId: '',
      form: {
        title: '',
        start: '',
        end: '',
        desc: '',
        email: ''
      }
    }
  },

  methods: {
    load () {
      this.eventId = this.$route.params;

      forEach(this.$route.query, (value, key) => {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = key === 'start' || key === 'end' ? moment(Number(value)).toDate() : value;
        }
      });
    },
    insertEvent () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          Visualforce.remoting.Manager.invokeAction(
            window.globalIds.CalendarController.insertEvent,
            this.form.title,
            moment(this.form.start).valueOf(),
            moment(this.form.end).valueOf(),
            this.form.desc,
            this.form.email,
            (error, event) => {
              if (error) {
                this.$error(error);
              } else {
                EventBus.$emit('calendar-refetch-events');
              }
            },
            { escape: true }
          );
        } else {
          return false;
        }
      });
    },
    cancel () {
      this.$router.push({ path: '/' });
    }
  },

  watch: {
    '$route': function () {
      this.load();
    }
  },

  mounted () {
    this.load();
  }
};
</script>

<style>
.title {
  font-weight: 900;
  margin: 0 0 20px 0;
}
</style>
