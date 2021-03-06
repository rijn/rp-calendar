<template>
  <div id="content">
    <!-- <h2>{{ displayWeekday }}</h2> -->
    <!-- <h4>{{ displayDate }}</h4> -->
    <el-row class="toolbox">
      <el-col :span="12">
        <!-- <span>Timezone</span>
        <el-select
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          v-model="timezone"
          placeholder="Timezone">
          <el-option
            v-for="item in timezones"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select> -->
      </el-col>
      <el-col :span="12">
        <el-switch
          style="display: inline-block; margin: 5px 0;"
          v-model="ampm"
          active-color="#dcdfe6"
          inactive-color="#dcdfe6"
          active-text="12 hr"
          inactive-text="24 hr">
        </el-switch>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;">
      <ul>
        <li v-if="slots.length === 0">
          unavailable
        </li>
        <li v-for="_slot in slots">
          <el-button
            class="time-button"
            type="primary"
            @click="clickSlot(_slot)"
            :plain="slot !== _slot">
            {{ moment.tz(_slot.start.toISOString(), timezone).format(ampm ? "hh:mm a" : "HH:mm") }}
            -
            {{ moment.tz(_slot.end.toISOString(), timezone).format(ampm ? "hh:mm a" : "HH:mm") }}
          </el-button>
        </li>
      </ul>
    </el-row>
    <el-row style="margin-top: 30px;">
      <el-button type="primary" :disabled="!slot" @click="confirm">Next</el-button>
    </el-row>
  </div>
</template>

<script>
var moment = require('moment-timezone');
import { Loading } from 'element-ui';
import _ from 'lodash';

export default {
  name: 'day-list',

  props: [ 'date' ],

  data () {
    return {
      moment,
      timezone: moment.tz.guess(),
      timezones: [],
      ampm: true,
      slots: [],
      slot: null
    };
  },

  computed: {
    displayWeekday: function () {
      return this.date && this.date.format("dddd");
    },
    displayDate: function () {
      return this.date && this.date.format("MMMM DD, Y");
    },
  },

  methods: {
    loadResources () {
      let loadingInstance = Loading.service({ fullscreen: true });
      window.$jsforce.query(`
        SELECT
          Name, StartTime__c, EndTime__c
        FROM
          CalendarEvent__c
        WHERE
          StartTime__c >= ${moment.tz(this.date.toISOString(), "America/Chicago").format()}
          AND EndTime__c < ${moment.tz(this.date.clone().add(1, 'd').toISOString(), "America/Chicago").format()}
        `).then(res => {
        let scheduledSlots = res.records.map(record => Object.assign({
          id: record.Name,
          start: moment(record['StartTime__c']),
          end: moment(record['EndTime__c'])
        }));

        this.applyFilterByDate(this.date, scheduledSlots);

        loadingInstance.close();
      });
    },
    applyFilterByDate (date, scheduledSlots) {
      let { mappers, filters } = this.$rules;

      let timeslots = _(mappers)
        .map(mapper => mapper(date))
        .flatten()
        .filter(obj => _.some(filters, filter => filter(obj)))
        .value();

      let availableTimeslots = _.differenceBy(timeslots, scheduledSlots, v => v.start.unix());

      this.slots = _(availableTimeslots)
        .map(({ start, duration }) => ({
          start,
          end: start.clone().add(duration)
        }))
        .value();
    },
    remoteMethod (query) {
      if (query !== '') {
        this.timezones = moment.tz.names().filter(item => {
          return item.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.timezones = [];
      }
    },
    clickSlot (slot) {
      this.slot = slot;
    },
    confirm () {
      this.$emit('select-slot', Object.assign({}, this.slot));
    }
  },

  mounted () {
    this.loadResources();
  }
};
</script>

<style scoped lang="less">
#content {
  text-align: center;
  max-width: 1080px;
  margin: 20px auto;
}
.toolbox {
  p {
    margin: 10px 0;
  }
}

ul {
  padding: 0;
}

li {
  list-style: none;
}

.time-button {
  max-width: 300px;
  width: 100%;
  padding: 20px;
  margin: 5px;
  font-size: 1em;
}
</style>
