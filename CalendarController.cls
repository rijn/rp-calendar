public with sharing class CalendarController {

  @RemoteAction
  public static String insertEvent(
    String title,
    Long startTime, Long endTime,
    String description,
    String email
  ) {
    String ret = '';

    try {
      insert new CalendarEvent__c(
        Title__c = title,
        StartTime__c = DateTime.newInstance(startTime), EndTime__c = DateTime.newInstance(endTime),
        Detail__c = description,
        Email__c = email
      );
    } catch(DmlException e) {
      System.debug('An unexpected error has occurred: ' + e.getMessage());
      ret = e.getMessage();
    }

    return ret;
  }

}
