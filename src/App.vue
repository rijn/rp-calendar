<template>
  <div id="app">
    <header>RP Event Calendar</header>
    <div id="content">
      <full-calendar :event-sources="eventSources" default-view="month"></full-calendar>
    </div>
  </div>
</template>

<script>
var moment = require('moment');

export default {
  name: 'app',
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
  mounted () {
  }
};
</script>

<style>
@import 'fullcalendar/dist/fullcalendar.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#content {
  max-width: 960px;
  margin: 0 auto;
}
</style>
