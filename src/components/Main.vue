<template>
  <el-container>
    <el-main>
      <div id="content">
        <full-calendar
          ref="calendar"
          :event-sources="eventSources"
          @event-created="eventCreated"
          default-view="month">
        </full-calendar>
      </div>
    </el-main>
    <el-aside class="aside"><router-view></router-view></el-aside>
  </el-container>

</template>

<script>
var moment = require('moment');
import { EventBus } from './event-bus.js';

export default {
  name: 'main',
  data () {
    return {
      eventSources: [
        {
          events(start, end, timezone, callback) {
            window.$jsforce.query(`
              SELECT
                Name, Title__c, Detail__c, StartTime__c, EndTime__c, Confirmed__c
              FROM
                CalendarEvent__c
              WHERE
                StartTime__c >= ${moment(start.toISOString()).toISOString()}
                AND EndTime__c < ${moment(end.toISOString()).toISOString()}
              `).then(res => {
              callback(res.records.map(record => ({
                id: record.Name,
                title: record['Title__c'],
                start: moment(record['StartTime__c']),
                end: moment(record['EndTime__c']),
                overlap: false,
                editable: false
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
      console.log(event);
    },
    refetchEvents () {
      this.$refs.calendar.$emit('refetch-events');
    }
  },
  mounted () {
    EventBus.$on('calendar-refetch-events', this.refetchEvents);
  },
  beforeDestroy () {
    EventBus.$off('calendar-refetch-events', this.refetchEvents);
  }
};
</script>

<style>
@import 'fullcalendar/dist/fullcalendar.css';
#content {
  max-width: 960px;
  margin: 0 auto;
}
.aside {
  max-width: 400px;
  overflow: hidden;
  padding: 20px;
  border-left: solid 1px #ddd;
}
</style>
