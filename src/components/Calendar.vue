<template>
  <!-- <el-container style="margin: 100px 20px 0 20px;"> -->
    <!-- <el-main> -->
      <div id="content">


        <full-calendar
          ref="calendar"
          :event-sources="eventSources"
          @event-created="eventCreated"
          @event-drop="eventDrop"
          @day-click="dayClick"
          default-view="month">
        </full-calendar>
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

export default {
  name: 'calendar',

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
    eventDrop (event) {
      this.$router.push({ path: '/' });
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
