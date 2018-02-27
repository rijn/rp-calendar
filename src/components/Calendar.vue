<template>
  <!-- <el-container style="margin: 100px 20px 0 20px;"> -->
    <!-- <el-main> -->
      <div id="content">
<!--         <full-calendar
          ref="calendar"
          :event-sources="eventSources"
          @event-created="eventCreated"
          @event-drop="eventDrop"
          @day-click="dayClick"
          default-view="month"
          :selectable="false"
          :editable="false"
          :header="{
            left: 'prev,next today',
            center: '',
            right: 'title'
          }">
        </full-calendar> -->
        <vue-event-calendar
          :events="events"
          @month-changed="handleMonthChanged"
          @day-changed="handleDayChanged">
        </vue-event-calendar>
<!--         <div class="legend">
          <ul>
            <li><span class="color" style="background: #abc327;"></span><span>Confirmed Event</span></li>
            <li><span class="color" style="background: #eacf02;"></span><span>Unconfirmed Event</span></li>
          </ul>
        </div> -->
      </div>
    <!-- </el-main> -->
    <!-- <el-aside class="aside" v-if="$route.params.eventId"><router-view></router-view></el-aside> -->
  <!-- </el-container> -->

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
      events: [],
      eventSources: [
        {
          events(start, end, timezone, callback) {
            let loadingInstance = Loading.service({ fullscreen: true });
            window.$jsforce.query(`
              SELECT
                Name, Title__c, Detail__c, StartTime__c, EndTime__c, Confirmed__c
              FROM
                CalendarEvent__c
              WHERE
                StartTime__c >= ${moment(start.toISOString()).toISOString()}
                AND EndTime__c < ${moment(end.toISOString()).toISOString()}
              `).then(res => {
              loadingInstance.close();
              callback(res.records.map(record => Object.assign({
                id: record.Name,
                title: record['Title__c'],
                start: moment(record['StartTime__c']),
                end: moment(record['EndTime__c']),
                editable: false,
              }, record['Confirmed__c'] ? {
                title: 'Schduled',
                backgroundColor: 'rgba(171, 195, 39, 0.7)',
                borderColor: 'rgba(171, 195, 39, 1)'
              } : {
                title: 'Available',
                backgroundColor: 'rgba(171, 195, 39, 0.2)',
                borderColor: 'rgba(171, 195, 39, 0.4)',
                textColor: 'rgba(0, 0, 0, 0.4)'
              })));
            });
          },
          color: 'yellow',
          textColor: 'black',
        }
      ]
    };
  },
  methods: {
    eventCreated (event) {
      // this.$router.push({ path: `/new?start=${moment(event.start.format()).valueOf()}&end=${moment(event.end.format()).valueOf() - 1}` });
    },
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
    eventDrop (event) {
      this.$router.push({ path: '/' });
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
</style>
