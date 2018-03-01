<template>
      <div id="content">
        <el-row class="toolbox">
          <el-col :span="24">
            <i class="el-icon-date"></i>
            <el-switch
              style="display: inline-block; margin: 5px 0;"
              v-model="displayInList"
              active-color="#dcdfe6"
              inactive-color="#dcdfe6"
              active-text="List"
              inactive-text="Calendar">
            </el-switch>
            <i class="el-icon-tickets"></i>
          </el-col>
        </el-row>
        <vue-event-calendar
          :events="events"
          :showCalendar="!displayInList"
          @month-changed="handleMonthChanged"
          @day-changed="handleDayChanged">
        </vue-event-calendar>
        <div v-if="displayInList">
          <ul style="text-align: center;">
            <li v-if="events.length === 0">
              unavailable
            </li>
            <li v-for="_event in events">
              <el-button
                class="time-button"
                type="primary"
                @click="handleDayChanged(_event)"
                plain>
                {{ moment(_event.date, "YYYY/MM/DD").format("YYYY-MM-DD dddd") }}
              </el-button>
            </li>
          </ul>
        </div>
      </div>
</template>

<script>
var moment = require('moment');
import { EventBus } from './event-bus.js';
import { Loading } from 'element-ui';
import _ from 'lodash';

export default {
  name: 'calendar',

  data () {
    return {
      moment,
      displayInList: false,
      events: []
    };
  },
  methods: {
    dayClick (date) {
      this.$emit('select-date', date);
    },
    handleDayChanged (obj) {
      this.$emit('select-date', moment(new Date(obj.date)));
    },
    handleMonthChanged (month) {
      this.applyFilterByMonth(month);
    },
    applyFilterByMonth (month) {
      let loadingInstance = Loading.service({ fullscreen: true });

      window.$jsforce.query(`
        SELECT
          Name, StartTime__c, EndTime__c
        FROM
          CalendarEvent__c
        WHERE
          StartTime__c >= ${moment(month, 'MM/YYYY').format()}
          AND EndTime__c < ${moment(month, 'MM/YYYY').clone().add({ month: 1 }).format()}
      `).then(res => {
        let scheduledSlots = res.records.map(record => Object.assign({
          id: record.Name,
          start: moment(record['StartTime__c']),
          end: moment(record['EndTime__c'])
        }));

        let dates = _(moment(month, 'MM/YYYY').daysInMonth() + 1)
          .range().drop()
          .map(day => moment(`${day}/${month}`, "DD/MM/YYYY"))
          .value();

        let { mappers, filters } = this.$rules;

        let timeslots = _(_.reduce(dates, (a, v) => _.concat(a, _.map(mappers, mapper => mapper(v))), []))
          .flatten()
          .filter(obj => _.some(filters, filter => filter(obj)))
          .value();

        let availableTimeslots = _.differenceBy(timeslots, scheduledSlots, v => v.start.unix());

        let availableDates = _(availableTimeslots).map('start').map(date => date.format('YYYY/MM/DD')).uniq().value();

        this.events = _(availableDates).map(date => ({ date, title: '' })).value();

        loadingInstance.close();
      });
    },
    refetchEvents () {
      this.$refs.calendar.$emit('refetch-events');
    }
  },
  mounted () {
    EventBus.$on('calendar-refetch-events', this.refetchEvents);
    this.applyFilterByMonth(moment().format('MM/YYYY'));
  },
  beforeDestroy () {
    EventBus.$off('calendar-refetch-events', this.refetchEvents);
  }
};
</script>

<style scoped lang="less">
#content {
  max-width: 1080px;
  margin: 20px auto;
  .legend {
    font-size: 0.8em;
    ul {
      padding: 0;
      margin: 20px 0 0 0;
    }
    li {
      list-style: none;
      padding: 3px 0;
      & > * {
        display: inline-block;
        vertical-align: middle;
      }
      .color {
        height: 5px;
        width: 20px;
        margin: 0 10px;
        border-radius: 2px;
      }
    }
  }
}
.aside {
  max-width: 320px;
  overflow: hidden;
  margin: 20px;
  padding: 30px;
  border-radius: 30px;
  background: #f5f5f5;
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
